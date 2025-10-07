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
      className="flex flex-col items-center w-full py-20"
      style={{ fontFamily: "monserrat" }}
    >
      <section className="flex w-full text-3xl max-lg:text-xl max-xl:text-xl py-10 max-lg:items-center bg-[#141414] ">
        <div className="flex justify-between items-baseline w-full max-lg:flex-col max-lg:items-center max-lg:justify-center  max-lg:gap-20 px-15">
          {/* Logo and title */}
          <div className="">
            <div
              className="flex text-pink-500 text-3xl "
              style={{ fontFamily: "Starstruck" }}
            >
              <a className="flex max-lg:text-center" href="/Landing">
                Harixom
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-col items-start justify-center">
            <h4 className="font-semibold pb-15 max-lg:pb-5 ">Products</h4>
            {props.products.map((product, index) => (
              <Link
                key={index}
                to={props.linksProducts[index]}
                className="hover:scale-110 duration-600 hover:text-[#FA6063] pb-5 max-lg:pb-2"
              >
                <li>{product}</li>
              </Link>
            ))}
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center justify-center max-lg:items-start">
            <h4 className="font-semibold pb-15 max-lg:pb-5">Social Medias</h4>
            <div className="grid grid-cols-2 gap-5">
              {props.socialMedias.map((socialMedia, index) => (
                <Link key={index} to={props.linksSocialMedia[index]}>
                  <img
                    src={socialMedia}
                    alt=""
                    className="hover:scale-110 duration-600 w-15 h-15 max-lg:w-15 max-lg:h-15 object-cover rounded-full"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="flex flex-col items-start justify-center pl-25">
            <h4 className="font-semibold pb-15 max-lg:pb-10">Contacts</h4>
            {props.contacts.map((contact, index) => (
              <a
                key={index}
                href={props.linksContacts[index]}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 duration-600 hover:text-[#FA6063] pb-5  max-lg:pb-2"
              >
                <li>{contact}</li>
              </a>
            ))}
          </div>
        </div>
      </section>

      <p className="w-full text-center text-xl bg-[#141414] p-3">
        © 2025 {props.titlePage}. All rights reserved
      </p>
    </footer>
  );
}
