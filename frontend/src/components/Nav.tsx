import { useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../components/helpers/config";
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

  const token = localStorage.getItem("access_token");

  // Obtener la información del usuario desde el mismo endpoint que el Profile
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfileNav"],
    queryFn: async () => {
      const { data } = await axiosRequest.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token,
  });

  const userImage =
    profileData?.user?.profile_picture ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Función logout
  const handleLogout = async () => {
    try {
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
        {/* Logo y barra de búsqueda */}
        <div className="flex items-center space-x-20 pl-12">
          {/* Logo */}
          <div
            className="text-pink-500 text-2xl"
            style={{ fontFamily: "Starstruck" }}
          >
            <a className="" href="/Landing">
              Harixom
            </a>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex bg-[#3b3b3b] rounded-full px-5 py-2 w-[550px] border-[#a8a8a8] border-1">
            <button className="text-pink-400 hover:text-pink-600 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-white outline-none w-full input font-semibold placeholder-gray-400"
            />
          </div>
        </div>

        {/* Navegación */}
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
                  className="flex items-center text-white font-bold bg-[#F778BD] py-1 px-4 rounded-full border-[#FFAFEE] border-2 hover:bg-[#ff32a3] transition-all"
                >
                  <img
                    src={userImage}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  Log out
                </button>
              ) : (
                <a
                  className="flex items-center text-white font-bold bg-[#8936D2] py-1 px-4 rounded-full border-[#A39FF6] border-2 hover:bg-[#7813c6] transition-all"
                  href="/Profile"
                >
                  <img
                    src={userImage}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
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
