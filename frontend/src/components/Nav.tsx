import { useLocation, useNavigate } from "@tanstack/react-router";
import { axiosRequest } from ".././components/helpers/config";

import { useToast } from "../components/ui/Toast";

interface NavProps {
  list: string[];
  reference: string[];
}

export default function Nav(props: NavProps) {
  const { showToast } = useToast();

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // función logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axiosRequest.post(
        "/user/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("access_token");
      showToast("Sesión cerrada exitosamente", "success");
      navigate({ to: "/" }); 
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      showToast("Error al cerrar sesión", "error");
    }
  };

  return (
    <section>

      <div className="flex items-center justify-between bg-[#151515] p-4">
        <div className="text-pink-500 text-2xl pl-12"
  style={{ fontFamily: "Starstruck" }}>
          <a className="" href="/Landing">Harixom</a>
        </div>

        <nav>
          <ul className="flex space-x-8 items-center">
            {props.list.map((list, i) => (
              <li key={i}>
                <a className="text-white" href={props.reference[i]}>
                  {list}
                </a>
              </li>
            ))}

            <li>
              {currentPath === "/Profile" ? (
                <button
                  onClick={handleLogout}
                  className="text-black font-bold bg-red-400 py-1 px-9 rounded-2xl border-rose-300 border-2"
                >
                  Log out
                </button>
              ) : (
                <a
                  className="text-black font-bold bg-[#8936D2] py-1 px-9 rounded-2xl border-[#A39FF6] border-2"
                  href="/Profile"
                >
                  Profile
                </a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
