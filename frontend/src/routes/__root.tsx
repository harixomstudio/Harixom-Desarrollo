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
      {!hideNav && (
        <>
          <Nav
            list={["Feed", "Create", "Events", "Inbox"]}
            reference={["/Feed", "/CreatePublication", "/Events", "/Inbox"]}
          />
          <SidebarNavigation />
        </>
      )}
      <div className="flex min-h-screen">
        {!hideNav && <div className="w-14 shrink-0" />} 
        {referenceEvents.includes(currentPath) && (
          <EventsNav
            listEvents={listEvents}
            referenceEvents={referenceEvents}
          />
        )}
        <div className="flex-1 bg-stone-950">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
}
