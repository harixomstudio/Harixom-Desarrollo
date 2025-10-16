import { Link, useLocation } from "@tanstack/react-router";

const icons = [
  { src: "home.svg", to: "/Landing", alt: "Home" },
  { src: "create.svg", to: "/CreatePublication", alt: "Create" },
  { src: "feed.svg", to: "/Feed", alt: "Feed" },
  { src: "premium.svg", to: "/Suscriptions", alt: "Suscriptions" },
  { src: "notifications.svg", to: "/Inbox", alt: "Notifications" },
  { src: "user.svg", to: "/Profile", alt: "Profile" },
  { src: "events.svg", to: "/Events", alt: "Events" },
  { src: "dashboars.svg", to: "/Dashboars", alt: "Dashboars" },
];

export default function SidebarNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="fixed top-0 left-0 h-screen bg-[#151515] z-40 transition-all duration-300 w-14 hover:w-48 overflow-hidden">
      <div className="pt-[100px] flex flex-col gap-6 px-2">
        {icons.map((item, index) => {
          const isActive = currentPath === item.to;
          return (
            <Link
              key={index}
              to={item.to}
              className={`flex items-center gap-6 transition-all duration-300 group pl-2 ${
                isActive ? "brightness-125" : ""
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`w-6 h-6 transition-transform ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              <span className="text-white text-sm font-medium opacity-100 transition-colors duration-300 group-hover:text-pink-500 group-hover:opacity-100 whitespace-nowrap">
                {item.alt}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
