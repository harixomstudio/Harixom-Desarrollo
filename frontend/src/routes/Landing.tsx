import { createFileRoute } from "@tanstack/react-router";
import Landing from "../components/pages/LandingPage";

export const Route = createFileRoute("/Landing")({
  component: RouteComponent,
});

const banners = [
  "banner1.svg",
  "banner2.svg",
  "banner3.svg",
];

const categoriesUp = [
  "icon-digitalart.svg",
  "icon-animacion.svg",
  "icon-sculture.svg",
  "icon-traditional.svg",
];
const categoriesUpNames = [
  "Digital Art",
  "Animatión",
  "Sculture",
  "Traditional",
];
const categoriesUpColors = [
  "#FFAFEE", // rosa
  "#A39FF6", // morado
  "#96E2FF", // celeste
  "#1AFB9B", // turquesa
];
const links = ["/DigitalArt", "/Animation", "/Sculture", "Traditional"];

const categoriesDown = [
  "icon-3d.svg",
  "icon-streetart.svg",
  "icon-foto.svg",
];
const categoriesDownNames = [
  "3D",
  "Street Art",
  "Photography",
];
const categoriesDownColors = [
  "#D6FF39", // verde
  "#FDD519", // naranja
  "#FA6063", // rojo
];
const links2 = ["/3d", "/StreetArt", "/Photography"];

const rankImg = ["circles.svg", "circles.svg", "circles.svg", "circles.svg"];
const rankingArtist = [
  "ARCANE FINAL.jpg",
  "evelyn.png",
  "reshiram.jpg",
  "ebal.jpeg",
];
const ArtistName = [
  "Arcane",
  "Evelyn Barrantes",
  "isaac",
  "Ebal Seemann",
];
const artName = [
  "Arcane Fanart",
  "thecirclessvg",
  "circlessvg",
  "Casa Creepy",
];
const linksArt = ["", "", "", "", "", "", "", "", "", ""];

const commisionsCategories = [
  "Retratos",
  "Diseño de tatuajes",
  "Paisajes",
  "Diseño de personajes",
  "Arte de mascotas",
  "Anime/Manga",
  "Comisiones personalizadas",
  "Fantasía",
  "Cartoon",
  "Realismo",
  "",
  "",
];
const linksCommisions = ["", "", "", "", "", "", "", "", "", "", "", ""];

const footer = {
  titlePage: "Harixom",
  logo: "LogoHarixom.svg",
  altLogo: "Logo",
  products: ["Explorar", "Comisiones", "Recursos", "Ayuda"],
  linksProducts: [""],
  socialMedias: ["instagram.svg", "facebook.svg", "tiktok.svg", "youtube.svg"],
  linksSocialMedia: [
    "https://www.instagram.com/harixom2025",
    "https://www.facebook.com/share/16myX55RSd/",
    "https://www.tiktok.com/@harixom2025",
    "https://youtube.com/@harixom_2025",
  ],
   contacts: ["+506 8394 7941", "harixonstudio@gmail.com"],
   linksContacts: ["https://wa.me/50683947941", "mailto:harixonstudio@gmail.com"],


   
};

function RouteComponent() {
  return (
    <Landing
      banners={banners}
      altBanner="a"
      categoriesUp={categoriesUp}
      categoriesUpNames={categoriesUpNames}
      categoriesUpColors={categoriesUpColors}
      links={links}
      categoriesDown={categoriesDown}
      categoriesDownNames={categoriesDownNames}
      categoriesDownColors={categoriesDownColors}
      links2={links2}
      imgApp="canva.svg"
      imgAppAlt="a"
      descriptionApp="Create, connect, and grow!"
      textApp="Welcome to Harixom, the social network for artists that offers a safe space to share your work, connect with other creators, and find a home for your art. Your talent deserves to be seen and valued."
      rankImg={rankImg}
      rankingArtist={rankingArtist}
      ArtistName={ArtistName}
      artName={artName}
      linksArt={linksArt}
      commisionsCategories={commisionsCategories}
      linksCommisions={linksCommisions}
      footer={footer}
    />
  );
}
