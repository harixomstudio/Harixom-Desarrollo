import * as React from "react";
import { Outlet, createRootRoute, useLocation, useNavigate } from "@tanstack/react-router";
import Nav from "../components/Nav";
import EventsNav from "../components/EventsNav";
import SidebarNavigation from "../components/SidebarNavigation";
import axios from "axios";
import { axiosRequest } from "../components/helpers/config";
import { useQuery } from "@tanstack/react-query";
import Inbox from '../components/pages/Inbox'
import { AppDataProvider } from "../components/helpers/AppDataContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

  const token = localStorage.getItem('access_token')
  const [notifications, setNotifications] = React.useState(0);
  const [notificationsData, setNotificationsData] = React.useState<any[]>([])

  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const hideNav = [
    "/",
    "/Register",
    "/Login",
    "/ForgotPassword",
    "/ResetPassword",
    "/SetProfile",
    "/Terms",
    "/ChangePassword"
  ].includes(currentPath);

  const listEvents = ["Events", "Workshop", "AI Challenges"];
  const referenceEvents = ["/Events", "/Workshops", "/AIChallenge"];
  const navigate = useNavigate();

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
        // comisiones recibidas
        const { data: notis } = await axios.get(
          `http://127.0.0.1:8000/api/notifications/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const myFollowers = notis.data.followers
        const myLikes = notis.data.likes
        const myCommissions = notis.data.commissions.filter(
          (comission: any) => comission.to_user_id === profileData?.user?.id
        )
        const myComments = notis.data.comments.filter(
          (comments: any) => parseInt(comments.for_user_id) === profileData?.user?.id
        )
        const myMessages = notis.data.messages.filter(
          (profile_message: any) => profile_message.to_user_id === profileData?.user?.id
        )

        const mergedNotifications = [ //unificacion de la data
          ...myMessages,
          ...myCommissions,
          ...myComments,
          ...myFollowers,
          ...myLikes
        ];
        setNotifications(mergedNotifications.length)
        setNotificationsData(mergedNotifications)

      } catch (err) {
        console.error('Error fetching messages wall:', err)
      }
    }

    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 45000);
    return () => clearInterval(intervalId);
  }, [profileData?.user?.id]);


  React.useEffect(() => {
    const publicRoutes = [
      "/",
      "/Register",
      "/Login",
      "/ForgotPassword",
      "/ResetPassword",
      "/ChangePassword",
    ];

    if (!token && !publicRoutes.includes(currentPath)) {
      navigate({ to: "/Login" });
    }
  }, [token, currentPath, navigate]);

  if (!token && ![
    "/",
    "/Register",
    "/Login",
    "/ForgotPassword",
    "/ResetPassword",
    "/ChangePassword",
  ].includes(currentPath)) {
    return null;
  }

  return (
    <AppDataProvider >
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

          <SidebarNavigation numberNotis={notifications} />
        </>
      )}

      {/* NOTIFICACIONES */}
      {currentPath === '/Inbox' &&
        <Inbox
          prioritys={notificationsData.map((number) => (number.status))}
          notification="Notifications"
          titles={notificationsData.map((number) => number.title || 'New Commission')}
          users={notificationsData.map((number) => number.from_user?.name || number.user?.name || number.name)}
          UsersID={notificationsData.map((number) => number.from_user?.id || number.user?.id || number.id || number.user_id)}
          texts={notificationsData.map((number) => number.message || number.comment)}
          howDoIt={notificationsData.map((number) => number.howDoIt)}
          details={notificationsData.map((number) => number.details)}
          dateDoIt={notificationsData.map((number) => number.dateDoIt)}
          dates={notificationsData.map((number) => new Date(number.created_at).toLocaleString() === 'Invalid Date' ? number.created_at : new Date(number.created_at).toLocaleString('es-CR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }))}
          images={notificationsData.map(() => 'bell.svg')}
          alts={notificationsData.map(() => 'bell')}
        />}

      {/* CONTENIDO PRINCIPAL */}
      {currentPath !== '/Inbox' &&
        <div className={`flex min-h-screen ${!hideNav ? "md:pl-14" : ""}`}>
          {!hideNav}
          <div className="flex-1 bg-stone-950 w-full">
            <Outlet />
          </div>
        </div>
      }
    </AppDataProvider>
  );
}
