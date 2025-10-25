import * as React from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import Nav from "../components/Nav";
import EventsNav from "../components/EventsNav";
import SidebarNavigation from "../components/SidebarNavigation";
import axios from "axios";
import { axiosRequest } from "../components/helpers/config";
import { useQuery } from "@tanstack/react-query";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

  const token = localStorage.getItem('access_token')
  const [notifications, setNotifications] = React.useState(0);

  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const hideNav = [
    "/",
    "/Register",
    "/Login",
    "/ForgotPassword",
    "/ResetPassword",
    "/SetProfile",
    "/Terms",
  ].includes(currentPath);

  const listEvents = ["Events", "Workshop", "AI Challenges"];
  const referenceEvents = ["/Events", "/Workshops", "/AIChallenge"];

  const { data: profileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axiosRequest.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token,
  });

  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return
      try {
        const { data: commissions } = await axios.get(
          `http://127.0.0.1:8000/api/user/commisions/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myCommissions = commissions.commissions.filter(
          (comission: any) => comission.to_user_id === profileData?.user?.id
        )

        const { data: messages } = await axios.get(
          `http://127.0.0.1:8000/api/profile/${profileData?.user?.id}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myNotifications = messages.filter(
          (profile_message: any) => profile_message.to_user_id === profileData?.user?.id
        )

        setNotifications(myCommissions.length + myNotifications.length)
      } catch (err) {
        console.error('Error fetching messages wall:', err)
      }
    }

    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, [profileData?.user?.id]);


  return (
    <React.Fragment>
      {/* NAV PRINCIPAL */}
      {!hideNav && (
        <>
          <Nav />

          {/* NAV DE EVENTOS (solo en las rutas especificadas) */}
          {referenceEvents.includes(currentPath) && (
            <EventsNav
              listEvents={listEvents}
              referenceEvents={referenceEvents}
            />
          )}

         <SidebarNavigation numberNotis={notifications } />
        </>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className={`flex min-h-screen ${!hideNav ? "pl-14" : ""}`}>
        {!hideNav}
        <div className="flex-1 bg-stone-950 w-full">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
}
