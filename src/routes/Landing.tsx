import { createFileRoute } from '@tanstack/react-router'
import Landing from '../components/pages/Landing';

export const Route = createFileRoute('/Landing')({
  component: RouteComponent,
})

const categoriesUp = ['circles.svg', 'circles.svg', 'circles.svg', 'circles.svg']
const links = ['', '', '', '']
const categoriesDown = ['circles.svg', 'circles.svg', 'circles.svg']
const links2 = ['', '', '']

const rankingArtist = ['circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg', 'circles.svg']
const ArtistName = ['Ed Sheeran', 'ebal adadadadadsdadadadsadasdasdasdaa', 'isaac', 'evelyn', 'zoe', 'lalo', 'rata', 'tara', 'truyu', 'yo']
const artName = ['thecircles', 'thecirclessvg', 'circlessvg', 'acirclessvg44sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfdsfsdfsdfsfsdf', 'gcirclessvg', 'kcirclessvg', 'aca', 'teyt', 'adadaffg', 'afaf']
const linksArt = ['', '', '', '', '', '', '', '', '', '']

const commisionsCategories = ['Retratos', 'Diseño de tatuajes', 'Paisajes', 'Diseño de personajes', 'Arte de mascotas', 'Anime/Manga', 'Comisiones personalizadas', 'Fantasía',]
const linksCommisions = ['', '', '']

const products = ['Explorar', 'Comisiones', 'Recursos', 'Ayuda']
const linksProducts = ['']

const socialMedia = ['circles.svg', 'circles.svg', 'circles.svg', 'circles.svg']
const linksSocialMedia = ['']

const contact = ['1234 6548',  'info@gmail.com',  'ucra'];
const linksContact = ['']

function RouteComponent() {
  return (
    <Landing
      banner="circles.svg"
      altBanner='a'

      categoriesUp={categoriesUp}
      links={links}
      categoriesDown={categoriesDown}
      links2={links2}

      imgApp="circles.svg"
      imgAppAlt="a"
      descriptionApp="Little description of the app "
      textApp="Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "

      rankingArtist={rankingArtist}
      ArtistName={ArtistName}
      artName={artName}
      linksArt={linksArt}

      commisionsCategories={commisionsCategories}
      linksCommisions={linksCommisions}

      titlePage="Harixom"
      logo="circles.svg"
      altLogo="a"

      products={products}
      linksProducts={linksProducts}

      socialMedias={socialMedia}
      linksSocialMedia={linksSocialMedia}

      contacts={contact}
      linksContacts={linksContact}
    />
  );
}

