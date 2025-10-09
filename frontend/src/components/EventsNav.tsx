import { Link, useRouterState } from "@tanstack/react-router";

interface EventsNavProps {
  listEvents: string[];
  referenceEvents: string[];
}

export default function EventsNav(props: EventsNavProps) {
  const { location } = useRouterState();

  return (
    <section className="w-56 bg-[#202020] text-white py-12 px-6 flex flex-col min-h-screen"
    style={{ fontFamily: "Monserrat" }}>
      <h2 className="text-xl font-bold mb-8 text-gray-300">Event Categories</h2>
      <nav className="space-y-6 w-full">
        <ul className="space-y-4">
          {props.listEvents.map((listEvents, i) => {
            const isActive = location.pathname === props.referenceEvents[i];
            return (
              <li key={i} className="w-full">
                <Link
                  to={props.referenceEvents[i]}
                  className={`block py-3 px-4 rounded-lg transition-all duration-200 text-lg font-medium w-full
                      ${isActive ? "bg-[#2d223a] text-purple-400" : "hover:bg-purple-900 hover:text-purple-200"}
                    `}
                >
                  {listEvents}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
