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
  {/*SE OCULTA EL NAV DE EVENTOS */}
  const hideEventsNav = [
    "/Feed",
    "/Login",
    "/Register",
    "/RegisterAdmin",
    "/ForgotPassword",
    "/Landing",
    "/",
    "/Profile",
    "/SetProfile",
    "/CreatePublication",
    "/DigitalArt",
    "/Animation",
    "/Sculture",
    "/Paint",
    "/3d",
    "/StreetArt",
    "/Photography",
  ].includes(currentPath);

  return (
    <React.Fragment>
      {!hideNav && (
        <Nav
          list={["Feed", "Create", "Events"]}
          reference={["/Feed", "/CreatePublication", "/Events"]}
        />
      )}
      {/* {!hideNav && <Nav list={[ 'About', 'Contact']} reference={['/about', '/contact']} />} */}
      <div className="flex min-h-screen">
        {!hideEventsNav && (
          <EventsNav
            listEvents={listEvents}
            referenceEvents={referenceEvents}
          />
        )}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
}
