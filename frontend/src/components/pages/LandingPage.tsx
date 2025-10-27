import { Link, useNavigate } from "@tanstack/react-router";
import Footer from "../Footer";
import { useInView } from "./useInView";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface FooterProps {
  titlePage: string;
  logo: string;
  altLogo: string;
  products: string[];
  linksProducts: string[];
  socialMedias: string[];
  linksSocialMedia: string[];
  contacts: string[];
  linksContacts: string[];
}

interface LandingProps {
  banners: string[];
  altBanner: string;
  categoriesUpNames: string[];
  categoriesDownNames: string[];
  categoriesUpColors: string[];
  categoriesDownColors: string[];
  categoriesUp: string[];
  links: string[];
  categoriesDown: string[];
  links2: string[];
  imgApp: string;
  imgAppAlt: string;
  descriptionApp: string;
  textApp: string;
  linksArt: string[];
  footer?: FooterProps;
}

interface Publication {
  id: number;
  user_id?: number;
  user_name?: string;
  user_profile_picture?: string;
  description?: string;
  image?: string;
  total_likes?: number;
  total_comments?: number;
  category?: string;
  created_at?: string;
}

interface TopArtist {
  id: number;
  user_id: number;
  artist_name: string;
  title: string;
  image: string;
  likes: number;
  profile_picture: string;
}

export default function Landing(props: LandingProps) {
  if (!props.footer) return null;

  const { ref: appRef, inView: appVisible } = useInView({ threshold: 0.3 });
  const navigate = useNavigate();
const [current, setCurrent] = useState(0);
const total = 4; // número real de banners

  const token = localStorage.getItem("access_token");
  const { data } = useQuery({
    queryKey: ["allPublications"],
    queryFn: async () => {
      const response = await fetch(
        "https://harixom-desarrollo.onrender.com/api/publications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error al obtener las publicaciones");
      const json = await response.json();
      return json.publications as Publication[];
    },
    enabled: !!token,
  });

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await axios.get(
          "https://harixom-desarrollo.onrender.com/api/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentUserId(data.user?.id ?? null);
      } catch (err) {
        console.log("No se pudo obtener current user:", err);
      }
    })();
  }, [token]);

  const topArtists: TopArtist[] = (data || [])
    .map((pub) => ({
      id: pub.id,
      user_id: pub.user_id ?? 0,
      artist_name: pub.user_name ?? "Desconocido",
      title: pub.description ?? "",
      image: pub.image ?? "",
      likes: pub.total_likes ?? 0,
      profile_picture: pub.user_profile_picture ?? "circles.svg",
    }))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 60000);

    return () => clearInterval(timer);
  }, [total]);

const nextSlide = () => {
  setCurrent((prev) => (prev + 1) % total);
};

const prevSlide = () => {
  setCurrent((prev) => (prev - 1 + total) % total);
};

  const styleTag = (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientFlow 4s ease infinite;
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0); }
          }

          .animate-fade-in {
            animation: fadeIn 1.5s ease-out forwards;
          }

          .animate-float {
            animation: float 2.5s ease-in-out infinite;
          }

          @keyframes paintStroke {
            0% { transform: translateX(-100%) scaleX(0.8); opacity: 0; }
            60% { opacity: 1; }
            100% { transform: translateX(0) scaleX(1); opacity: 1; }
          }


@keyframes fadeText {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-paint-stroke {
  animation: paintStroke 1.5s ease-out forwards;
}

.animate-fade-text {
  animation: fadeText 1.2s ease-out 1.6s forwards;
  opacity: 0;
}
        `,
      }}
    />
  );


  return (
    <>
      {styleTag}
      <main className="pt-12 w-full bg-[#141414] text-white"style={{ fontFamily: "Montserrat" }}>
        {/* Línea rosa animada debajo del nav */}
        <div className="relative w-full h-1.5 overflow-hidden bottom-12">
          <div className="absolute w-full h-full bg-gradient-to-r from-pink-300 via-pink-800 to-pink-300 animate-gradient" />
        </div>
        {/* Carrusel */}
        <div className="relative w-full h-[73vh] max-sm:h-[30vh] max-md:h-[45vh] max-lg:h-[50vh] max-xl:h-[55vh] overflow-hidden text-black">
          <div
            className="flex transition-transform duration-[1800ms] ease-in-out h-full w-full "
            style={{ transform: `translateX(-${current * 100}%)` }}
          >


             {/* Banner 0 */}
        <div className="min-w-full h-full relative flex items-center justify-center">
          <img
           src="banner4.svg" alt="Banner 0"
            className="absolute w-full h-full object-cover"
           />
          <div className="z-10 text-center flex flex-col items-center gap-7 px-4">
            <h1
              className="text-black text-2xl max-sm:text-2xl max-md:text-3xl max-lg:text-4xl max-xl:text-5xl font-bold"
              style={{ fontFamily: "Montserrat" }}
            >
              Welcome to
            </h1>
             <h2
              className="text-pink-600 text-8xl max-sm:text-lg max-md:text-xl max-lg:text-1xl max-xl:text-2xl"
               style={{ fontFamily: "Starstruck" }}
             >
               Harixom
             </h2>
          </div>
        </div>



            {/* Banner 1 */}
            <div className="min-w-full h-full relative flex items-center justify-center">
              <img
                src={props.banners[0]}
                alt={props.altBanner}
                className="absolute w-full h-full object-cover"
              />
              <div className="z-10 text-center pb-20 sm:pb-32 md:pb-40 lg:pb-48">
                <h1
                  className="text-pink-700 text-4xl max-sm:text-2xl max-md:text-3xl max-lg:text-4xl max-xl:text-5xl font-bold"
                  style={{ fontFamily: "Montserrat" }}
                >
                 The Empty space
                </h1>
                <h2
                  className="text-black text-2xl max-sm:text-lg max-md:text-xl max-lg:text-1xl max-xl:text-2xl p-2"
                  style={{ fontFamily: "Montserrat" }}
                >
                 Holds endless possibilities
                </h2>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="min-w-full h-full relative flex items-center justify-center">
              <img
                src={props.banners[1]}
                alt={props.altBanner}
                className="absolute w-full h-full object-cover"
              />
              <div className="z-10 text-center flex flex-col items-center gap-5 pt-10">
                <h1
                  className="text-black text-4xl max-sm:text-2xl max-md:text-3xl max-lg:text-4xl max-xl:text-5xl font-bold"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Participate in incredible Events
                </h1>
                <h2
                  className="text-pink-700 text-2xl max-sm:text-lg max-md:text-xl max-lg:text-1xl max-xl:text-2xl"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Discover the power of creativity
                </h2>
                <Link
                  to="/Events"
                  className="mt-2 px-10 sm:px-16 md:px-20 py-2 sm:py-3 bg-purple-400 text-black text-lg sm:text-xl md:text-2xl font-semibold rounded-full hover:bg-purple-600 transition duration-300"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Join
                </Link>
              </div>
            </div>

            {/* Banner 3 */}
            <div className="min-w-full h-full relative flex items-center justify-center">
              <img
                src={props.banners[2]}
                alt={props.altBanner}
                className="absolute w-full h-full object-cover"
              />

              {/* Contenedor centrado */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 gap-15">
                {/* Imagen pincelada con texto encima */}
                <div className="relative w-full flex items-center justify-center">
               
                  <h2
                    className={`absolute inset-0 flex items-center justify-center text-black text-5xl max-sm:text-2xl max-md:text-3xl max-lg:text-4xl max-xl:text-5xl font-bold text-center ${current === 2 ? "animate-fade-text" : ""}`}
                    style={{ fontFamily: "Montserrat" }}
                  >
                    Get inspired and Create your own Art
                  </h2>
                </div>

                {/* Botón debajo */}
                <Link
                  to="/Categories/$name"
                  params={{ name: "Digital Art" }}
                  className="mt-6 px-10 sm:px-16 md:px- py-2 bg-pink-400 text-black text-lg sm:text-xl md:text-2xl font-bold rounded-full hover:scale-110 transition z-10 "
                  style={{ fontFamily: "Montserrat" }}
                >
                  Create now
                </Link>
              </div>
            </div>
          </div>

          {/* Flechas de navegación */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 sm:left-5 transform -translate-y-1/2 text-pink-400 text-4xl sm:text-5xl md:text-6xl font-bold hover:scale-125 transition z-10"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 sm:right-5 transform -translate-y-1/2 text-pink-400 text-4xl sm:text-5xl md:text-6xl font-bold hover:scale-125 transition z-10"
          >
            ›
          </button>
        </div>

        {/* categories section */}
        <section className="flex flex-col items-center justify-center gap-10 pt-40 pb-32 px-4 ">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-pink-300 flex gap-1"
            style={{ fontFamily: "Montserrat" }}
          >
            {"Categories".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "6.0s",
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                  display: "inline-block",
                }}
              >
                {char}
              </span>
            ))}
          </h2>

          {/* Upper categories */}
          <div
            className="flex flex-wrap justify-center gap-30 max-xl:gap-20 max-lg:gap-10 pt-5 duration-500"
            style={{ fontFamily: "Montserrat" }}
          >
            {props.categoriesUp.map((categoriesUp, number) => (
              <Link
                to={props.links[number]}
                key={number}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={categoriesUp}
                  alt={`Image ${number}`}
                  className="w-15 h-15 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 duration-600 hover:scale-110 hover:shadow-lg shadow-black"
                />
                <span
                  className="text-center text-sm sm:text-base md:text-lg font-medium"
                  style={{ color: props.categoriesUpColors[number] }}
                >
                  {props.categoriesUpNames[number]}
                </span>
              </Link>
            ))}
          </div>

          {/* Lower categories */}
          <div
            className="flex flex-wrap justify-center gap-30 max-xl:gap-20 max-lg:gap-10 duration-500"
            style={{ fontFamily: "Montserrat" }}
          >
            {props.categoriesDown.map((categoriesDown, number) => (
              <Link
                to={props.links2[number]}
                key={number}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={categoriesDown}
                  alt={`Image ${number}`}
                  className="w-15 h-15 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 duration-600 hover:scale-110 hover:shadow-lg shadow-black"
                />
                <span
                  className="text-center text-sm sm:text-base md:text-lg font-medium"
                  style={{ color: props.categoriesDownColors[number] }}
                >
                  {props.categoriesDownNames[number]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* app section */}
        <section
          ref={appRef}
          className="relative flex flex-row max-xl:flex-col items-center justify-center py-20 bg-[#FFAFEE] text-black px-4  overflow-hidden"
        >
          <img
            src="Fondo-rosa.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Imagen de la app */}
          <div className="relative flex justify-center items-center w-full lg:w-1/2 mb-10 lg:mb-0">
            <img
              src={props.imgApp}
              alt={props.imgAppAlt}
              className={`w-3/4 sm:w-2/3 object-contain transition-all duration-1000 ease-out ${
                appVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            />
          </div>

          {/* Texto de la app */}
          <div className="relative z-10 flex flex-col w-full lg:w-2/3 text-justify justify-center gap-8 sm:gap-10 max-xl:items-center items-start">
            <h2
              className={`text-3xl sm:text-3xl md:text-3xl font-bold text-center lg:text-left transition-all duration-1000 ease-out ${
                appVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ fontFamily: "Montserrat" }}
            >
              {props.descriptionApp}
            </h2>
            <p
              className={`text-base sm:text-lg md:text-xl lg:text-xl text-center lg:text-left px-2 lg:px-0 transition-all duration-1000 ease-out ${
                appVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ fontFamily: "Montserrat" }}
            >
              {props.textApp}
            </p>

            <div className="flex justify-center lg:justify-start items-center py-5">
              <Link
                to="/CreatePublication"
                className="px-8 sm:px-12 md:px-16 py-3 text-base sm:text-lg md:text-xl font-semibold rounded-full bg-gradient-to-r from-pink-800 to-pink-400 hover:scale-110 transition-transform duration-500 shadow-lg animate-float text-white"
                style={{ fontFamily: "Montserrat" }}
              >
                Create your publication!
              </Link>
            </div>
          </div>
        </section>

        {/* artists ranking */}
        <section
          className="flex flex-col items-center justify-center gap-16 py-30 px-4 sm:px-8 md:px-12 lg:px-20"
          style={{ fontFamily: "Montserrat" }}
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-pink-300 flex gap-1 py-5"
            style={{ fontFamily: "Montserrat" }}
          >
            {"Artist        Ranking".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "7.0s",
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                  display: "inline-block",
                }}
              >
                {char}
              </span>
            ))}
          </h2>

          <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-10 w-full">
            {topArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => {
                  if (artist.user_id && artist.user_id === currentUserId) {
                    navigate({ to: "/Profile" });
                  } else {
                    navigate({
                      to: "/ProfileGuest",
                      search: { userId: artist.user_id },
                    });
                  }
                }}
                className="flex flex-col items-center gap-6 sm:gap-10 hover:scale-105 duration-500 cursor-pointer"
              >
                <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.title}
                    className="w-full h-full object-cover"
                  />

                  {/* foto de perfil del artista */}
                  <img
                    src={artist.profile_picture}
                    alt={artist.artist_name}
                    className="absolute bottom-4 left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white object-cover"
                  />

                  <div className="absolute bottom-4 right-4 flex text-white text-lg sm:text-xl">
                    <button className="hover:scale-110 duration-200">
                      ❤️ {artist.likes}
                    </button>
                  </div>
                </div>

                <div className="text-center text-white text-base sm:text-lg">
                  <h4>Artista: {artist.artist_name}</h4>
                  <p>Obra: {artist.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feed section */}
        <section
          className="relative flex flex-col items-center justify-center text-center w-full min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen text-white px-4 sm:px-8 md:px-12"
          style={{
            backgroundImage: "url('fondolila.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Título central */}
          <h2
            className="text-4xl max-sm:text-4xl max-md:text-5xl max-lg:text-6xl font-bold mb-10 sm:mb-16 animate-fade-in text-black"
            style={{ fontFamily: "Montserrat" }}
          >
            Get to know our artists through the Feed!!
          </h2>

          {/* Botón animado */}
          <Link
            to="/Feed"
            className="px-8 sm:px-12 md:px-16 py-3 text-base sm:text-lg md:text-xl font-semibold rounded-full bg-gradient-to-r from-purple-800 to-purple-500 hover:scale-110 transition-transform duration-500 shadow-lg animate-float"
            style={{ fontFamily: "Montserrat" }}
          >
            GO!
          </Link>
        </section>

        <Footer {...props.footer} />

      </main>
    </>
  );
}
