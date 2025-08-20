import { Link } from "@tanstack/react-router";

interface LandingProps {
    banner: string;
    altBanner: string;

    categoriesUp: string[];
    links: string[];
    categoriesDown: string[];
    links2: string[];

    imgApp: string;
    imgAppAlt: string;
    descriptionApp: string;
    textApp: string;

    rankingArtist: string[];
    ArtistName: string[];
    artName: string[];
    linksArt: string[];

    commisionsCategories: string[];
    linksCommisions: string[];

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

export default function Landing(props: LandingProps) {
    return (
        <main className="pt-40 w-full bg-[#141414] text-white">

            {/* banner img */}
            <div className="relative w-full mx-auto h-[70vh] max-lg:h-[30vh] justify-around px-15  ">
                <img className="w-full h-full object-cover rounded-4xl bg-white" src={props.banner} alt={props.altBanner} />
            </div>

            {/* new section the categories of the app */}
            <section className="flex flex-col items-center justify-center gap-25 py-80 max-lg:gap-10 max-lg:py-30 px-15">
                <h2 className="text-7xl font-semibold max-lg:text-4xl pb-20 max-lg:pb-10"> Categories</h2>
                <div className="flex justify-around w-full ">
                    {props.categoriesUp.map((categoriesUp, number) => (
                        <Link to={props.links[number]}>
                            <img src={categoriesUp} alt={`Image ${number}`} className='w-50 h-50 object-cover rounded-3xl bg-white max-xl:w-25 max-xl:h-25 duration-600 max-lg:w-17 max-lg:h-20 hover:scale-110 hover:shadow-lg shadow-white' />
                        </Link>
                    ))}
                </div>
                <div className="flex justify-around w-3/4">
                    {props.categoriesDown.map((categoriesDown, number) => (
                        <Link to={props.links2[number]}>
                            <img src={categoriesDown} alt={`Image ${number}`} className='w-50 h-50 object-cover rounded-3xl bg-white duration-600 max-xl:w-25 max-xl:h-25 max-lg:w-17 max-lg:h-20 hover:scale-110 hover:shadow-lg shadow-white' />
                        </Link>
                    ))}
                </div>
            </section>

            {/* new section about the app */}
            <section className="flex items-center justify-center py-30 max-lg:flex-col bg-[#FFAFEE] text-black h-screen w-full" >
                <div className=" flex w-1/2 object-cover justify-center items-center h-screen ">
                    <img src={props.imgApp} alt={props.imgAppAlt} className=" w-2/3 object-cover h-2/3 bg-white rounded-3xl border" />
                </div>
                <div className="flex flex-col w-1/2 h-screen text-justify justify-center gap-35 max-lg:gap-5 max-lg:w-3/4">

                    <h2 className="text-5xl font-semibold max-lg:text-2xl"> {props.descriptionApp}</h2>
                    <p className="w-3/4 text-2xl max-lg:text-sm">{props.textApp}</p>

                </div>
            </section>

            {/* new section the artists ranking */}
            <section className="flex flex-col items-center justify-center gap-25 py-80 max-lg:gap-10 max-lg:py-30 px-15">
                <h2 className="text-7xl font-semibold max-lg:text-4xl pb-20 max-lg:pb-10">Artists ranking</h2>
                <div className="flex flex-wrap justify-around w-full gap-25 text-2xl ">
                    {props.rankingArtist.map((rankingArtist, number) => (
                        <Link to={props.linksArt[number]} className="flex flex-col w-130 hover:scale-110 duration-600 text-center gap-10 overflow-hidden">
                            <img src={rankingArtist} alt={`Image ${number}`} className='w-130 h-130 object-cover rounded-3xl bg-white duration-600 max-xl:w-25 max-xl:h-25 max-lg:w-17 max-lg:h-20 hover:shadow-lg shadow-white' />
                            <div className="whitespace-nowrap">
                                <h4 >Artista: {props.ArtistName[number]}</h4>
                                <p>Obra: {props.artName[number]}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* new section about the commission of the app */}
            <section className="text-center justify-center py-30 max-lg:flex-col bg-[#A39FF6] text-black h-screen w-full ">
                <h2 className="text-7xl font-semibold max-lg:text-4xl pb-20 max-lg:pb-10">Commisions</h2>
                <div className=" justify-center text-2xl columns-2 ">
                    {props.commisionsCategories.map((commisionsCategories, number) => (
                        <Link to={props.linksCommisions[number]} className="flex justify-center pb-15 cursor-default" >
                            <p className="font-semibold hover:scale-110 duration-600 hover:text-[#FA6063] cursor-pointer" >{commisionsCategories}</p>
                        </Link>
                    ))}
                </div>
            </section>
            {/* the footer of the app */}
            <footer className="flex flex-col items-center justify-center py-30 h-screen">

                {/* the decoration between the footer and the section up */}
                <div className="relative bottom-1/3">
                    <img src="lineDecoration.svg" alt="decoration" className=" " />
                </div>

                <section className="flex justify-around w-full items-baseline text-3xl py-20">

                    {/* the footer of the app */}
                    <div className="flex flex-col items-center justify-center">
                        <h4 className="font-semibold pb-15">{props.titlePage} </h4>
                        <img src={props.logo} alt={props.altLogo} className="w-25 h-25 bg-amber-50 object-cover" />
                    </div>

                    {/* the products of the app */}
                    <div className="flex flex-col items-start justify-center ">
                        <h4 className="font-semibold pb-15">Products</h4>
                        {props.products.map((products, number) => (
                            <Link to={props.linksProducts[number]} className=" hover:scale-110 duration-600 hover:text-[#FA6063] pb-5" >
                                <li>{products}</li>
                            </Link>
                        ))}
                    </div>

                    {/* the social networks of the app */}
                    <div className="flex flex-col items-center justify-center ">
                        <h4 className="font-semibold pb-15">Social Medias</h4>
                        <div className="grid grid-cols-2">
                            {props.socialMedias.map((socialMedia, number) => (
                                <Link to={props.linksSocialMedia[number]}>
                                    <img src={socialMedia} alt='' className="hover:scale-110 duration-600 w-25 h-25 bg-amber-50 object-cover m-5 rounded-full" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* the contats of the app */}
                    <div className="flex flex-col items-start justify-center ">
                        <h4 className="font-semibold pb-15">Contacts</h4>
                        {props.contacts.map((contacts, number) => (
                            <Link to={props.linksContacts[number]} className=" hover:scale-110 duration-600 hover:text-[#FA6063] pb-5 " >
                                <li>{contacts}</li>
                            </Link>
                        ))}
                    </div>
                </section>
                <p>© 2025 {props.titlePage}. All rights reserved</p>
            </footer>

        </main>
    );
}

