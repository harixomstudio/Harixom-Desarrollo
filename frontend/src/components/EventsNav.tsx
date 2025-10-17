import { Link, useRouterState } from "@tanstack/react-router";

interface EventsNavProps {
  listEvents: string[];
  referenceEvents: string[];
}

export default function EventsNav(props: EventsNavProps) {
  const { location } = useRouterState();

  return (
    <section
      className="w-full bg-[#202020] text-white py-2 px-6 flex justify-center items-center space-x-6 flex-wrap"
      style={{ fontFamily: "Monserrat" }}
    >
      <nav className="flex flex-wrap justify-center gap-4">
        {props.listEvents.map((listEvents, i) => {
          const isActive = location.pathname === props.referenceEvents[i];
          return (
            <Link
              key={i}
              to={props.referenceEvents[i]}
              className={`py-2 px-4 rounded-lg transition-all duration-200 text-lg font-medium 
                ${isActive ? "bg-[#2d223a] text-purple-400" : "hover:bg-purple-900 hover:text-purple-200"}
              `}
            >
              {listEvents}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
