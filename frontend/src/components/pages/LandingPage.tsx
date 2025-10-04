import { Link } from "@tanstack/react-router";
import Footer from "../Footer";
import { useInView } from "./useInView";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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

  commisionsCategories: string[];
  linksCommisions: string[];

  footer?: FooterProps;
}

interface Publication {
  id: number;
  user_id: number;
  user_name: string;
  user_profile_picture: string;
  description: string;
  image: string;
  total_likes: number;
  total_comments: number;
  category: string;
  created_at: string;
}

interface TopArtist {
  id: number;
  artist_name: string;
  title: string;
  image: string;
  likes: number;
  profile_picture: string;
}

export default function Landing(props: LandingProps) {
  if (!props.footer) return null;

  const { ref: appRef, inView: appVisible } = useInView({ threshold: 0.3 });

  const [current, setCurrent] = useState(0);
  const total = props.banners.length;

  const token = localStorage.getItem("access_token");
  const { data } = useQuery({
    queryKey: ["allPublications"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/publications", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al obtener las publicaciones");
      const json = await response.json();
      return json.publications as Publication[];
    },
    enabled: !!token,
  });

  // Tomamos los 4 con más likes
  const topArtists: TopArtist[] = (data || [])
    .map(pub => ({
      id: pub.id,
      artist_name: pub.user_name || "Desconocido",
      title: pub.description,
      image: pub.image,
      likes: pub.total_likes || 0,
      profile_picture: pub.user_profile_picture || "default-avatar.png", // por si no hay foto
    }))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 60000);


    return () => clearInterval(timer);
  }, [total]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);

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
      <main className="pt-12 w-full bg-[#141414] text-white">
        {/* Línea rosa animada debajo del nav */}
        <div className="relative w-full h-1.5 overflow-hidden bottom-12">
          <div className="absolute w-full h-full bg-gradient-to-r from-pink-300 via-pink-800 to-pink-300 animate-gradient" />
        </div>

        {/* Carrusel */}
        <div className="relative w-full h-[70vh] max-lg:h-[40vh] overflow-hidden text-black">
          <div
            className="flex transition-transform duration-[1800ms] ease-in-out h-full w-full gap-"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >




            {/* Banner 1 */}
            <div className="min-w-full h-full relative flex items-center justify-center">
              <img
                src={props.banners[0]}
                alt={props.altBanner}
                className="absolute w-full h-full object-cover "
              />
              <div className="z-10 text-center pb-48">
                <h1 className="text-black text-5xl max-lg:text-4xl font-bold" style={{ fontFamily: "Monserrat" }}>
                  Canvas Flow
                </h1>
                <h2 className="text-black text-3xl max-lg:text-xl p-2" style={{ fontFamily: "Monserrat" }}>
                  Unleash Your Inner Artist
                </h2>
              </div>
            </div>



            {/* Banner 2 */}
            <div className="min-w-full h-full relative flex items-center justify-center">
              <img
                src={props.banners[1]}
                alt={props.altBanner}
                className="absolute w-full h-full object-cover "
              />
              <div className="z-10 text-center flex flex-col items-center gap-5 pt-10">
                <h1 className="text-black text-5xl max-lg:text-4xl font-bold" style={{ fontFamily: "Monserrat" }}>
                  Participate in incredible Events
                </h1>
                <h2 className="text-black text-3xl max-lg:text-xl" style={{ fontFamily: "Monserrat" }}>
                  Discover the power of creativity
                </h2>
                <Link
                  to="/Events"
                  className="mt-2 px-20 py-3 bg-purple-500 text-black text-2xl font-semibold rounded-full hover:bg-purple-600 transition duration-300"
                  style={{ fontFamily: "Monserrat" }}
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
              <div className="relative z-10 w-full flex items-center justify-center">
                <img
                  src="pincelada.svg"
                  alt="Pincelada"
                  className={`absolute max-w-[1000px] h-auto ${current === 2 ? "animate-paint-stroke" : ""}`}
                  style={{ animationFillMode: "forwards" }}
                />
                <h2
                  className={`absolute text-black text-4xl max-lg:text-xl font-bold text-center ${current === 2 ? "animate-fade-text" : ""}`}
                  style={{ fontFamily: "Monserrat" }}
                >
                  Get inspired and Create your own Art
                </h2>

                {/* Botón animado */}
                <Link
                  to="/DigitalArt"
                  className="absolute top-10 px-20 py-2 bg-blue-600 text-2xl font-bold rounded-full hover:scale-125 transition z-10"
                  style={{ fontFamily: "Monserrat" }}
                >
                  GO!
                </Link>

              </div>
            </div>


          </div>

          {/* Flechas de navegación */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-5 transform -translate-y-1/2 text-pink-400 text-6xl font-bold hover:scale-125 transition z-10"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-5 transform -translate-y-1/2 text-pink-400 text-6xl font-bold hover:scale-125 transition z-10"
          >
            ›
          </button>
        </div>



        {/* categories section */}
        <section className="flex flex-col items-center justify-center gap-20 pt-30 pb-45 max-lg:gap-10 max-lg:py-30 px-15 max-lg:px-5">
          <h2
            className="text-5xl md:text-7xl text-pink-300 flex gap-1"
            style={{ fontFamily: "Monserrat" }}
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
          <div
            className="flex justify-between pt-5 gap-43"
            style={{ fontFamily: "Monserrat" }}
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
                  className="w-30 h-30 max-xl:w-22 max-xl:h-22 duration-600 max-lg:w-15 max-lg:h-15 hover:scale-115 hover:shadow-lg shadow-black"
                />
                <span
                  className="text-center text-xl max-lg:text-sm font-medium"
                  style={{ color: props.categoriesUpColors[number] }}
                >
                  {props.categoriesUpNames[number]}
                </span>
              </Link>
            ))}
          </div>

          <div
            className="flex justify-between gap-40"
            style={{ fontFamily: "Monserrat" }}
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
                  className="w-30 h-30 duration-600 max-xl:w-22 max-xl:h-22 max-lg:w-15 max-lg:h-15 hover:scale-115 hover:shadow-lg shadow-black"
                />
                <span
                  className="text-center text-xl max-lg:text-sm font-medium"
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
          className="relative flex items-center py-30 bg-[#FFAFEE] text-black px-15 max-lg:flex-col max-lg:px-5 overflow-hidden"
        >
          <img
            src="Fondo-rosa.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="relative flex justify-center items-center">
            <img
              src={props.imgApp}
              alt={props.imgAppAlt}
              className={`w-2/3 object-contain transition-all duration-1000 ease-out ${appVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
                }`}
            />
          </div>

          <div className="relative z-10 flex flex-col w-1/2 text-justify justify-center gap-10 max-lg:gap-5 max-lg:w-full max-lg:items-center">
            <h2
              className={`text-5xl max-lg:text-3xl font-bold transition-all duration-1000 ease-out ${appVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
                }`}
              style={{ fontFamily: "Monserrat" }}
            >
              {props.descriptionApp}
            </h2>
            <p
              className={`text-2xl max-lg:text-lg pr-10 transition-all duration-1000 ease-out ${appVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
                }`}
              style={{ fontFamily: "Monserrat" }}
            >
              {props.textApp}
            </p>

            <div className="flex justify-center items-center py-5 ">
              {/* Botón animado */}
              <Link
                to="/CreatePublication"
                className="px-30  py-3 text-xl font-semibold rounded-full bg-gradient-to-r from-pink-800 to-pink-400 hover:scale-115 transition-transform duration-500 shadow-lg animate-float text-white "
                style={{ fontFamily: "Monserrat" }}
              >
                Create your publication!
              </Link>
            </div>
          </div>
        </section>




        {/* artists ranking */}

        <section className="flex flex-col items-center justify-center gap-25 py-50 max-lg:gap-10 max-lg:py-30">
          <h2 className="text-5xl md:text-7xl text-pink-300 flex gap-1">Artists Ranking</h2>
          <div className="grid grid-cols-2 gap-10 w-full px-15 max-lg:grid-cols-1 max-lg:px-5">
            {topArtists.map((artist: TopArtist, idx: number) => (
              <Link
                key={artist.id}
                to={props.linksArt[idx] || "#"}
                className="flex flex-col items-center gap-10 hover:scale-105 duration-500"
              >
                <div className="relative w-lg h-100 rounded-xl overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Foto de perfil real del artista */}
                  <img
                    src={artist.profile_picture}
                    alt={artist.artist_name}
                    className="absolute bottom-4 left-4 w-12 h-12 rounded-full border-2 border-white object-cover"
                  />

                  <div className="absolute bottom-4 right-4 flex text-white text-xl">
                    <button className="hover:scale-110 duration-200">❤️{artist.likes}</button>
                  </div>
                </div>
                <div className="text-center text-white text-lg">
                  <h4>Artista: {artist.artist_name}</h4>
                  <p>Obra: {artist.title}</p>
                </div>
              </Link>
            ))}

          </div>
        </section>

        {/* Feed section */}
        <section
          className="relative flex flex-col items-center justify-center text-center w-full h-screen text-white px-5"
          style={{
            backgroundImage: "url('fondolila.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Título central */}
          <h2
            className="text-6xl max-lg:text-4xl font-bold mb-20 animate-fade-in text-black"
            style={{ fontFamily: "Monserrat" }}
          >
            Get to know our artists through the Feed!!
          </h2>

          {/* Botón animado */}
          <Link
            to="/Feed"
            className="px-30 py-3 text-xl font-semibold rounded-full bg-gradient-to-r from-purple-800 to-purple-500 hover:scale-115 transition-transform duration-500 shadow-lg animate-float"
            style={{ fontFamily: "Monserrat" }}
          >
            GO!
          </Link>
        </section>

        <Footer {...props.footer} />
      </main>
    </>
  );
}
