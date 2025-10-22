import * as React from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import Nav from "../components/Nav";
import EventsNav from "../components/EventsNav";
import SidebarNavigation from "../components/SidebarNavigation";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

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

          <SidebarNavigation />
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
