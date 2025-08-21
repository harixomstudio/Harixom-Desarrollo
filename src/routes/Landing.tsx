import { createFileRoute } from '@tanstack/react-router'
import Landing from '../components/pages/Landing';
import Footer from '../components/Footer';

export const Route = createFileRoute('/Landing')({
  component: RouteComponent,
})

const categoriesUp = ['icon-digitalart.svg', 'icon-animacion.svg', 'icon-sculture.svg', 'icon-traditional.svg']
const links = ['', '', '', '']
const categoriesDown = ['icon-3d.svg', 'icon-streetart.svg', 'icon-foto.svg']
const links2 = ['', '', '']

const rankingArtist = ['circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg']
const ArtistName = ['Ed Sheeran', 'ebal adadadadadsdadadadsadasdasdasdaa', 'isaac', 'evelyn', 'zoe', 'lalo', 'rata', 'tara', 'truyu', 'yo']
const artName = ['thecircles', 'thecirclessvg', 'circlessvg', 'acirclessvg44sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfdsfsdfsdfsfsdf', 'gcirclessvg', 'kcirclessvg', 'aca', 'teyt', 'adadaffg', 'afaf']
const linksArt = ['', '', '', '', '', '', '', '', '', '']

const commisionsCategories = ['Retratos', 'Diseño de tatuajes', 'Paisajes', 'Diseño de personajes', 'Arte de mascotas', 'Anime/Manga', 'Comisiones personalizadas', 'Fantasía',]
const linksCommisions = ['', '', '']

const footer = {
  titlePage: "Harixom",
  logo: "circles.svg",
  altLogo: "a",
  products: ['Explorar', 'Comisiones', 'Recursos', 'Ayuda'],
  linksProducts: [''],
  socialMedias: ['instagram.svg', 'facebook.svg', 'tiktok.svg', 'youtube.svg'],
  linksSocialMedia: ['https://www.instagram.com', 'https://www.facebook.com', 'https://tiktok.com', 'https://youtube.com'],
  contacts: ['1234 6548', 'info@gmail.com', '1234 6548', 'info@gmail.com'],
  linksContacts: ['']
}

function RouteComponent() {
  return (
    <Landing
      banner="banner.svg"
      altBanner='a'

      categoriesUp={categoriesUp}
      links={links}
      categoriesDown={categoriesDown}
      links2={links2}

      imgApp="details.svg"
      imgAppAlt="a"
      descriptionApp="Little description of the app "
      textApp="Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "

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

