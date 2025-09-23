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
    <footer className="flex flex-col items-center  w-full py-20"
      style={{ fontFamily: "monserrat" }}>
      <section className="flex  w-full text-3xl max-lg:text-xl max-xl:text-xl py-10 max-lg:items-cente bg-[#141414]">
        <div className="flex justify-between items-baseline w-full max-lg:flex-col max-lg:items-center max-lg:gap-20 px-15 ">
          {/* the footer of the app */}
          <div className="flex flex-col items-center justify-center max-lg:items-center ">
            <h4 className="font-semibold pb-15 max-lg:pb-10">
             
            </h4>
             <div className="text-pink-500 text-3xl pl-10"
  style={{ fontFamily: "Starstruck" }}>
          <a className="" href="/Landing">Harixom</a>
        </div>
          </div>

          {/* the products of the app */}
          <div className="flex flex-col items-start justify-center">
            <h4 className="font-semibold pb-15 max-lg:pb-5">Products</h4>
            {props.products.map((products, number) => (
              <Link
                to={props.linksProducts[number]}
                className=" hover:scale-110 duration-600 hover:text-[#FA6063] pb-5 max-lg:pb-2"
              >
                <li>{products}</li>
              </Link>
            ))}
          </div>

          {/* the social networks of the app */}
          <div className="flex flex-col items-center justify-center max-lg:items-start">
            <h4 className="font-semibold pb-15 max-lg:pb-5">Social Medias</h4>
            <div className="grid grid-cols-2 gap-5">
              {props.socialMedias.map((socialMedia, number) => (
                <Link to={props.linksSocialMedia[number]}>
                  <img
                    src={socialMedia}
                    alt=""
                    className="hover:scale-110 duration-600 w-15 h-15 max-lg:w-15 max-lg:h-15 object-cover  rounded-full"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* the contats of the app */}
          <div className="flex flex-col items-start justify-center ">
            <h4 className="font-semibold pb-15 max-lg:pb-10">Contacts</h4>
            {props.contacts.map((contacts, number) => (
              <Link
                to={props.linksContacts[number]}
                className=" hover:scale-110 duration-600 hover:text-[#FA6063] pb-5 max-lg:pb-2 "
              >
                <li>{contacts}</li>
              </Link>
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
