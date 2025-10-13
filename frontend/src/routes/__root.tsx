import * as React from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import Nav from "../components/Nav";
import EventsNav from "../components/EventsNav";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

  React.useEffect(() => { // Deshabilitar el menu contextual para no poner copiar, ni inspeccionar
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Rutas donde NO quieres mostrar el Nav
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
 
  return (
    <React.Fragment>
      {!hideNav && (
        <Nav
          list={["Feed", "Create", "Events", "Inbox"]}
          reference={["/Feed", "/CreatePublication", "/Events", "/Inbox"]}
        />
      )}
      {/* {!hideNav && <Nav list={[ 'About', 'Contact']} reference={['/about', '/contact']} />} */}
      <div className="flex min-h-screen">
        {referenceEvents.includes(currentPath) && (
          <EventsNav
            listEvents={listEvents}
            referenceEvents={referenceEvents}
          />
        )}
        <div className="flex-1 bg-stone-950 w-full">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
}
