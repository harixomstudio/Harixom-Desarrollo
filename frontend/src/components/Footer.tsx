import { Link } from "@tanstack/react-router";

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

export default function Footer(props: FooterProps) {
  return (
    <footer
      className="flex flex-col items-center w-full py-10"
         style={{ fontFamily: "Montserrat" }}>
    

      <section className="flex w-full text-base max-md:text-base bg-[#141414]">
        <div className="flex justify-evenly items-start w-full max-md:flex-col max-md:items-center max-md:gap-15 max-md:px-0">
          {/* Logo and title */}
          <div className="flex flex-col items-center justify-center max-lg:items-center max-md:w-full max-md:items-center">
           
            <div
              className="text-pink-500 text-3xl pl-4 max-md:pl-0 -mt-2"

              style={{ fontFamily: "Starstruck" }}
            >
              <a className="flex max-lg:text-center" href="/Landing">
                Harixom
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-col items-start justify-center max-md:w-full max-md:items-center">
            <h5 className="font-semibold pb-4 text-lg">Interactions</h5>
            {props.products.map((product, index) => (
              <Link
                key={index}
                to={props.linksProducts[index]}
                className="hover:scale-110 duration-300 hover:text-[#FA6063] pb-2 text-base"
              >
                <li className="list-none">{product}</li>
              </Link>
            ))}
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center justify-center max-md:w-full max-md:items-center">
            <h5 className="font-semibold pb-4 text-lg">Social Medias</h5>
            <div className="grid grid-cols-2 gap-4">
              {props.socialMedias.map((socialMedia, index) => (
                <a
                  key={index}
                  href={props.linksSocialMedia[index]}
                  target="_blank" // Abre en una pestaña nueva
                  rel="noopener noreferrer" // Mejora la seguridad
                >
                  <img
                    src={socialMedia}
                    alt=""
                    className="hover:scale-110 duration-300 w-12 h-12 max-lg:w-10 max-lg:h-10 object-cover rounded-full"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="flex flex-col items-start justify-center max-md:w-full max-md:items-center">
            <h5 className="font-semibold pb-4 text-lg">Contacts</h5>
            {props.contacts.map((contact, index) => (
              <a
                key={index}
                href={props.linksContacts[index]}
                target={
                  props.linksContacts[index].startsWith("http")
                    ? "_blank" // Solo abre en nueva pestaña si es un enlace externo
                    : "_self"
                }
                rel="noopener noreferrer"
                className="hover:scale-110 duration-300 hover:text-[#FA6063] pb-2 text-base"
              >
                <li className="list-none">{contact}</li>
              </a>
            ))}
          </div>
        </div>
      </section>

      <p className="w-full text-center text-base bg-[#141414] pt-15">
        © 2025 {props.titlePage}. All rights reserved
      </p>
    </footer>
  );
}
