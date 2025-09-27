import { Link } from "@tanstack/react-router";
import Footer from "../Footer";
import { useInView } from "./useInView"; // ajusta la ruta si es necesario

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
  banner: string;
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

  rankImg: string[];
  rankingArtist: string[];
  ArtistName: string[];
  artName: string[];
  linksArt: string[];

  commisionsCategories: string[];
  linksCommisions: string[];

  footer?: FooterProps;
}

export default function Landing(props: LandingProps) {
  if (!props.footer) return null;

  const { ref: appRef, inView: appVisible } = useInView({ threshold: 0.3 });

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
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
      `,
          }}
        />

        {/* banner img */}

        <div className="relative w-full h-[70vh] max-lg:h-[40vh] px-15 max-lg:px-5">
          <img
            className="w-full h-full rounded-3xl object-cover"
            src={props.banner}
            alt={props.altBanner}
          />
          <div className="absolute inset-0 flex items-center justify-center bottom-75 flex-col">
            <h1
              className="text-black text-5xl max-lg:text-5xl font-bold"
              style={{ fontFamily: "Monserrat" }}
            >
              Canvas Flow
            </h1>
            <h2
              className="text-black text-3xl max-lg:text-3xl p-2"
              style={{ fontFamily: "Monserrat" }}
            >
              Unleash Your Inner Artist
            </h2>
          </div>
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
                  className="w-30 h-30 max-xl:w-22 max-xl:h-22 duration-600 max-lg:w-15 max-lg:h-15 hover:scale-150 hover:shadow-lg shadow-black"
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
                  className="w-30 h-30 duration-600 max-xl:w-22 max-xl:h-22 max-lg:w-15 max-lg:h-15 hover:scale-150 hover:shadow-lg shadow-black"
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
              className={`w-2/3 object-contain transition-all duration-1000 ease-out ${
                appVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            />
          </div>

          <div className="relative z-10 flex flex-col w-1/2 text-justify justify-center gap-10 max-lg:gap-5 max-lg:w-full max-lg:items-center">
            <h2
              className={`text-5xl max-lg:text-3xl font-bold transition-all duration-1000 ease-out ${
                appVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ fontFamily: "Monserrat" }}
            >
              {props.descriptionApp}
            </h2>
            <p
              className={`text-2xl max-lg:text-lg pr-10 transition-all duration-1000 ease-out ${
                appVisible
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
          <h2
            className="text-5xl md:text-7xl text-pink-300 flex gap-1"
            style={{ fontFamily: "Monserrat" }}
          >
            {"Artists         Ranking".split("").map((char, i) => (
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

          <div className="grid grid-cols-2 gap-10 w-full px-15 max-lg:grid-cols-1 max-lg:px-5">
            {props.rankingArtist.map((rankingArtist, number) => (
              <Link
                to={props.linksArt[number]}
                key={number}
                className="flex flex-col items-center gap-10 hover:scale-105 duration-500"
              >
                <div className="relative w-lg h-100 rounded-xl overflow-hidden">
                  <img
                    src={rankingArtist}
                    alt={`Obra ${number}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Avatar del artista */}
                  <img
                    src={props.rankImg[number]}
                    alt={`Avatar ${number}`}
                    className="absolute bottom-4 left-4 w-12 h-12 rounded-full border-2 border-white object-cover"
                  />

                  {/* Íconos de interacción */}
                  <div className="absolute bottom-4 right-4 flex text-white text-xl">
                    <button className="hover:scale-110 duration-200">❤️</button>
                  </div>
                </div>

                {/* Texto descriptivo */}
                <div className="text-center text-white text-lg">
                  <h4>Artista: {props.ArtistName[number]}</h4>
                  <p>Obra: {props.artName[number]}</p>
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
