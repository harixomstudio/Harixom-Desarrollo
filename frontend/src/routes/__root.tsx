import * as React from "react";
import { Outlet, createRootRoute, useLocation, useNavigate } from "@tanstack/react-router";
import Nav from "../components/Nav";
import EventsNav from "../components/EventsNav";
import SidebarNavigation from "../components/SidebarNavigation";
import axios from "axios";
import { axiosRequest } from "../components/helpers/config";
import { useQuery } from "@tanstack/react-query";
import Inbox from '../components/pages/Inbox'

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
        // comisiones recibidas
        const { data: commissions } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/user/commisions/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        // mensajes recibidos en el wall
        const { data: messages } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/profile/${profileData?.user?.id}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        // comentarios recibidos en las publicaciones
        const { data } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/user/comments/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        // seguidores recibidos
        const { data: followersData } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/user/follows`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        // los likes que se reciben en cada publiccacion
        const { data: likesData } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/user/likes/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        //se saca toda la data del json y se filtra
        const myCommissions = commissions.commissions.filter(
          (comission: any) => comission.to_user_id === profileData?.user?.id
        )
        const myNotifications = messages.messages.filter(
          (profile_message: any) => profile_message.to_user_id === profileData?.user?.id
        )
        const myComments = data.comments.filter(
          (comments: any) => parseInt(comments.for_user_id) === profileData?.user?.id
        )
        const myFollowers = followersData.followers
        const myLikes = likesData.likes


        const mergedNotifications = [ //unificacion de la data
          ...myNotifications,
          ...myCommissions,
          ...myComments,
          ...myFollowers,
          ...myLikes
        ];

        mergedNotifications.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });


        setNotifications(mergedNotifications.length)
        setNotificationsData(mergedNotifications)

      } catch (err) {
        console.error('Error fetching messages wall:', err)
      }
    }

    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 25000);
    return () => clearInterval(intervalId);
  }, [profileData?.user?.id]);

    const navigate = useNavigate();

  React.useEffect(() => {
    const publicRoutes = [
      "/",
      "/Register",
      "/Login",
      "/ForgotPassword",
      "/ResetPassword",
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
  ].includes(currentPath)) {
    return null;
  }

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
    </React.Fragment>
  );
}
