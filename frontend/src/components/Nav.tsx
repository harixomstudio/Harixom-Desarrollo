import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../components/helpers/config";
import { useToast } from "../components/ui/Toast";

export default function Nav() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null); // Referencia para el menú desplegable
  const imageRef = useRef<HTMLImageElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalProfile, setModalProfile] = useState(false);

  const token = localStorage.getItem("access_token");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const { data: profileData } = useQuery({
    queryKey: ["userProfileNav"],
    queryFn: async () => {
      const { data } = await axiosRequest.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token,
  });

  const userImage =
    profileData?.user?.profile_picture ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const handleLogout = async () => {
    try {
      if (!token) return;
      await axiosRequest.post(
        "/user/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("access_token");
      showToast("Sesión cerrada exitosamente", "success");
      navigate({ to: "/" });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      showToast("Error al cerrar sesión", "error");
    }
  };
  const handleChangePassword = async () => {
    try {
      const response = await axiosRequest.post("change-password",
        {
          email: profileData?.user?.email

        });
      showToast(response.data.message);
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Error al enviar el correo.",
        "error"
      )

    }
  };

    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        if (searchTerm.trim().length > 0) {
          handleSearch();
        } else {
          setShowModal(false);
        }
      }, 400);
      return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

  useEffect(() => {
    if (profileData?.user?.id) {
      setCurrentUserId(profileData.user.id);
    }
  }, [profileData]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const query = searchTerm.length === 1 ? `${searchTerm}%` : searchTerm;
      const { data } = await axiosRequest.get(`/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      showToast("Error al buscar", "error");
    }
  };

  const icons = [
    { src: "home.svg", to: "/Landing", alt: "Home" },
    { src: "create.svg", to: "/CreatePublication", alt: "Create" },
    { src: "feed.svg", to: "/Feed", alt: "Feed" },
    { src: "premium.svg", to: "/Suscriptions", alt: "Suscriptions" },
    { src: "notifications.svg", to: "/Inbox", alt: "Notifications" },
    { src: "events.svg", to: "/Events", alt: "Events" },
    { src: "dashboars.svg", to: "/Dashboard", alt: "Dashboard" },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node) && imageRef.current?.contains(event.target as Node)) {
      setModalProfile(false); // Cierra el menú si se hace clic fuera de él
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <section
      className="bg-[#151515] relative z-50 "
      style={{ fontFamily: "Montserrat" }}
    >
      <div className="flex items-center justify-between p-4">
        {/* Logo + barra de búsqueda */}
        <div className="flex items-center space-x-4 pl-4 flex-1">
          <div
            className="text-pink-500 text-2xl cursor-pointer"
            style={{ fontFamily: "Starstruck" }}
            onClick={() => navigate({ to: "/Landing" })}
          >
            Harixom
          </div>

          {/* Barra de búsqueda visible en todos los dispositivos */}
          <div className="flex bg-[#3b3b3b] rounded-full px-5 py-2 w-full max-w-[420px] border border-[#a8a8a8]">
            <button
              onClick={handleSearch}
              className="text-pink-400 hover:text-pink-600 mr-4"
            >
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
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white outline-none w-full font-semibold placeholder-gray-400"
            />
          </div>
        </div>

        {/* Botón hamburguesa solo en móviles */}
        <div className="md:hidden pr-4 ml-5">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-pink-400 hover:text-pink-500 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Acceso al perfil (solo escritorio) */}
        {/* Menú desplegable para modalProfiles */}
        <ul className="pr-6 hidden md:flex items-center relative">
          <li>

            <img
              ref={imageRef}
              onClick={() => setModalProfile(!modalProfile)}
              src={userImage}
              alt="User Profile"
              className={`w-12 h-12 rounded-full transition-transform duration-300 hover:scale-110 cursor-pointer`}
              id="modalProfile" />

            {modalProfile && (
              <div
                ref={menuRef} // Asocia el menú desplegable a la referencia
                className="absolute right-6 mt-4 w-60 bg-[#272727] rounded-2xl shadow-lg z-50 p-3"
              >
                <div className="flex w-full justify-end-safe px-3">
                  <button onClick={() => setModalProfile(!modalProfile)} className="flex items-center justify-end text-white hover:text-pink-500 duration-300  hover:bg-stone-700 rounded-full px-2.5 py-1 font-semibold">X</button>
                </div>
                <ul className="flex flex-col py-2 gap-1 px-3">
                  <Link
                    to="/Profile"
                    className="w-full text-left px-4 py-3 text-white hover:bg-[#155dfc] bg-stone-900 rounded-t-2xl transition-all "
                    onClick={() => setModalProfile(false)} // Cierra el menú al hacer clic
                  > Profile
                  </Link>

                  <li>
                    <button
                      className=" w-full text-left px-4 py-3 text-white bg-stone-900 hover:bg-pink-600 transition-all flex "
                      onClick={() => {
                        setModalProfile(false);
                        navigate({ to: "/DataSubscription" });
                      }} // Cierra el menú al hacer clic
                    >
                      <span className="text-pink-400"></span> Show subscriptions
                    </button>
                  </li>

                  <li>
                    <button
                      className=" w-full text-left px-4 py-3 text-white bg-stone-900 hover:bg-pink-600 transition-all flex "
                      onClick={() => { setModalProfile(false); handleChangePassword(); }} // Cierra el menú al hacer clic
                    >
                      <span className="text-pink-400"></span> Change Password
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setModalProfile(false); // Cierra el menú al hacer clic
                      }}
                      className=" w-full text-left px-4 py-3 text-white hover:bg-red-600 bg-stone-900 rounded-b-2xl transition-all "
                    >
                      <span className="text-red-400"></span> Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Menú lateral móvil */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#1a1a1a] shadow-lg transform transition-transform duration-300 z-50 ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Info de usuario (ahora con enlace al perfil) */}
          <Link
            to="/Profile"
            className="flex items-center gap-3 mb-6 border-b border-gray-600 pb-4 hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)} // cerrar menú al hacer click
          >
            <img
              src={userImage}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-white font-semibold">
              {profileData?.user?.name || "Usuario"}
            </div>
          </Link>

          {/* Links */}
          <nav className="flex flex-col gap-5">
            {icons.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex items-center gap-3 text-white hover:text-pink-400 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <img src={item.src} alt={item.alt} className="w-5 h-5" />
                <span className="text-md">{item.alt}</span>
              </Link>
            ))}
          </nav>

          {/* Contenedor para los botones */}
          
          <div className="mt-auto flex flex-col gap-4">

            {/* Botón para mostrar las suscripciones */}
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate({ to: "/DataSubscription" });
              }}
              className="bg-[#474cb5] hover:bg-[#343aae] text-white font-semibold py-2 rounded-lg transition-all"
            >
              Show Subscriptions
            </button>
            {/* Botón para cambiar contraseña */}
            <button
              onClick={() => {
                handleChangePassword();
                setMenuOpen(false); // Cierra el menú al hacer clic
              }}
              className="bg-[#8936D2] hover:bg-[#7104d0] text-white font-semibold py-2 rounded-lg transition-all"
            >
              Change Password
            </button>

            {/* Botón logout */}
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Fondo oscuro al abrir el menú */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
      {/* 🧾 Modal de resultados */}
      {showModal && searchResults && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-[#222] rounded-2xl p-6 w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto shadow-lg border border-pink-400">
            <h2 className="text-2xl text-pink-400 font-bold mb-4">
              Resultados de búsqueda
            </h2>

            {/* Usuarios */}
            <div>
              <h3 className="text-lg text-gray-300 font-semibold mb-2">
                Usuarios
              </h3>
              {searchResults.users?.length ? (
                <ul className="space-y-3">
                  {searchResults.users.map((user: any) => (
                    <li
                      key={user.id}
                      className="flex items-center gap-3 bg-[#333] rounded-lg p-3 hover:bg-[#444] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user.id === currentUserId) {
                          navigate({ to: "/Profile" });
                        } else {
                          navigate({
                            to: "/ProfileGuest",
                            search: { userId: user.id },
                          });

                          setTimeout(() => window.location.reload(), 100);
                        }
                        setShowModal(false);
                      }}
                    >
                      <img
                        src={
                          user.profile_picture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-white font-medium flex items-center gap-1">
                        {user.name}
                        {user.isPremium && (
                          <img
                            src="/premium.svg"
                            alt="Insignia Premium"
                            className="w-2 h-2"
                          />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">
                  No se encontraron usuarios
                </p>
              )}
            </div>

            <hr className="my-4 border-gray-600" />

            {/* Obras */}
            <div>
              <h3 className="text-lg text-gray-300 font-semibold mb-2">
                Obras
              </h3>
              {searchResults.publications?.length ? (
                <ul className="grid grid-cols-2 gap-4">
                  {searchResults.publications.map((pub: any) => (
                    <li
                      key={pub.id}
                      className="bg-[#333] p-3 rounded-lg hover:bg-[#444] cursor-pointer flex flex-col items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pub.user_id === Number(currentUserId)) {
                          navigate({ to: "/Profile" });
                        } else {
                          navigate({
                            to: "/ProfileGuest",
                            search: { userId: pub.user_id },
                          });
                        }
                        setShowModal(false);
                      }}
                    >
                      <img
                        src={pub.image}
                        alt={pub.description}
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                      <p className="text-white text-sm text-center">
                        {pub.description}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No se encontraron obras</p>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
