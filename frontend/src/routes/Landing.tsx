import { createFileRoute } from "@tanstack/react-router";
import Landing from "../components/pages/LandingPage";

export const Route = createFileRoute("/Landing")({
  component: RouteComponent,
});


const banners = [

  "banner1.svg",
  "banner2.svg",
  "baanner3.svg",
  "banner4.svg",
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
const links = ["/Categories/Digital Art", "/Categories/Animation", "/Categories/Sculpture", "/Categories/Traditional"];

const categoriesDown = [
  "icon-3d.svg",
  "icon-streetart.svg",
  "icon-foto.svg",
];
const categoriesDownNames = [
  "3D Art",
  "Street Art",
  "Photos",
];
const categoriesDownColors = [
  "#D6FF39", // verde
  "#FDD519", // naranja
  "#FA6063", // rojo
];
const links2 = ["/Categories/3D Art", "/Categories/Street Art", "/Categories/Photos"];

const linksArt = ["", "", "", "", "", "", "", "", "", ""];

const footer = {
  titlePage: "Harixom",
  logo: "LogoHarixom.svg",
  altLogo: "Logo",
  products: ["Explore", "Frequently questions", "Contact us"],
  linksProducts: [
    "/Feed",
    "/FAQ",
    "/Report",
  ],
  socialMedias: ["instagram.svg", "facebook.svg", "tiktok.svg", "youtube.svg"],
  linksSocialMedia: [
    "https://www.instagram.com/harixom2025",
    "https://www.facebook.com/share/16myX55RSd/",
    "https://www.tiktok.com/@harixom2025",
    "https://youtube.com/@harixom_2025",
  ],
   contacts: ["+506 8394 7941", "harixonstudio@gmail.com", "Report a suggestion or problem"],
   linksContacts: ["https://wa.me/50683947941", "mailto:harixonstudio@gmail.com","/Report"],


   
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
      linksArt={linksArt}
      footer={footer}
    />
  );
}
