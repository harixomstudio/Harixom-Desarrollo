import { createFileRoute } from "@tanstack/react-router";
import Landing from "../components/pages/LandingPage";

export const Route = createFileRoute("/Landing")({
  component: RouteComponent,
});

const categoriesUp = [
  "icon-digitalart.svg",
  "icon-animacion.svg",
  "icon-sculture.svg",
  "icon-traditional.svg",
];
const links = ["", "", "", ""];
const categoriesDown = ["icon-3d.svg", "icon-streetart.svg", "icon-foto.svg"];
const links2 = ["", "", ""];

const rankImg = ["circles.svg", "circles.svg", "circles.svg", "circles.svg"];
const rankingArtist = [
  "circles.svg",
  "circles.svg",
  "circles.svg",
  "circles.svg",
];
const ArtistName = [
  "Ed Sheeran",
  "ebal adadadadadsdadadadsadasdasdasdaa",
  "isaac",
  "evelyn",
];
const artName = [
  "thecircles",
  "thecirclessvg",
  "circlessvg",
  "acirclessvg44sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfdsfsdfsdfsfsdf",
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
  contacts: ["+506 8394 7941", "harixomstudios@gmail.com"],
  linksContacts: [""],
};

function RouteComponent() {
  return (
    <Landing
      banner="banner.svg"
      altBanner="a"
      categoriesUp={categoriesUp}
      links={links}
      categoriesDown={categoriesDown}
      links2={links2}
      imgApp="details.svg"
      imgAppAlt="a"
      descriptionApp="About the Harixom"
      textApp="Harixom is an innovative application designed for artists to share and monetize their artwork in a safe and professional environment. The platform ensures full copyright protection, preventing any possibility of image theft or unauthorized use. Artists can freely upload all kinds of creative content—such as paintings, digital art, music, photography, and more—while maintaining ownership of their work. In addition, Harixom provides opportunities for commercialization, allowing creators to earn money through their art."
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
