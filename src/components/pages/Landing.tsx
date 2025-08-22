import { Link } from "@tanstack/react-router";
import Footer from "../Footer";

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

    return (
        <main className="pt-40 w-full bg-[#141414] text-white ">

            {/* banner img */}
            <div className=" w-full h-[70vh] max-lg:h-[40vh] px-15 max-lg:px-5">
                <img className="w-full h-full " src={props.banner} alt={props.altBanner} />
            </div>

            {/* new section the categories of the app */}
            <section className="flex flex-col items-center justify-center gap-20 py-75 max-lg:gap-10 max-lg:py-30 px-15 max-lg:px-5">
                <h2 className="text-7xl  max-lg:text-4xl pb-15 max-lg:pb-10 font-berkshire"> Categories</h2>
                <div className="flex justify-between w-full ">
                    {props.categoriesUp.map((categoriesUp, number) => (
                        <Link to={props.links[number]}>
                            <img src={categoriesUp} alt={`Image ${number}`} className='w-40 h-40 max-xl:w-25 max-xl:h-25 duration-600 max-lg:w-17 max-lg:h-20 hover:scale-110 hover:shadow-lg shadow-black' />
                        </Link>
                    ))}
                </div>
                <div className="flex justify-between w-3/4">
                    {props.categoriesDown.map((categoriesDown, number) => (
                        <Link to={props.links2[number]}>
                            <img src={categoriesDown} alt={`Image ${number}`} className='w-40 h-40  duration-600 max-xl:w-25 max-xl:h-25 max-lg:w-17 max-lg:h-20 hover:scale-110 hover:shadow-lg shadow-black
                            ' />
                        </Link>
                    ))}
                </div>
            </section>

            {/* new section about the app */}
            <section className="flex items-center py-30 bg-[#FFAFEE] text-black px-15 gap-35 max-lg:flex-col max-lg:px-5" >
                <div className="w-1/2 flex justify-start items-center max-lg:w-full ">
                    <img src={props.imgApp} alt={props.imgAppAlt} className="w-full object-cover " />
                </div>
                <div className="flex flex-col w-1/2 text-justify justify-center gap-35 max-lg:gap-5 max-lg:w-full max-lg:items-center">
                    <h2 className="text-5xl max-lg:text-3xl font-berkshire"> {props.descriptionApp}</h2>
                    <p className=" text-2xl max-lg:text-lg">{props.textApp}</p>
                </div>
            </section>

            {/* new section the artists ranking */}
            <section className="flex flex-col items-center justify-center gap-25 py-80 max-lg:gap-10 max-lg:py-30 ">
                <h2 className="text-7xl max-lg:text-5xl pb-20 max-lg:pb-10 font-berkshire">Artists ranking</h2>
                <div className="flex flex-wrap justify-between w-full gap-30 max-lg:gap-10 text-2xl max-lg:text-sm px-15 max-lg:px-5">
                    {props.rankingArtist.map((rankingArtist, number) => (
                        <Link to={props.linksArt[number]} className="flex flex-col items-center w-3/7 hover:scale-110 duration-600 text-center gap-10 max-lg:gap-3 max-lg:pb-10 overflow-hidden">
                            <img src={props.rankImg[number]} alt={`Image ${number}`} className='bg-amber-50 w-25 h-25 max-lg:w-10 max-lg:h-10 rounded-full ' />
                            <img src={rankingArtist} alt={`Image ${number}`} className='bg-amber-50 w-full h-150 max-lg:h-60 object-cover rounded-4xl duration-600 hover:shadow-lg shadow-black' />
                            <div className="whitespace-nowrap">
                                <h4 >Artista: {props.ArtistName[number]}</h4>
                                <p>Obra: {props.artName[number]}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* new section about the commission of the app */}
            <section className="flex flex-col relative justify-center text-center bg-[#A39FF6] max-lg:h-1/1 text-black w-full h-screen py-30 ">
                <h2 className="text-8xl max-lg:text-4xl pb-40 max-lg:pb-15 font-berkshire">Commisions</h2>
                <div className=" flex flex-wrap w-full text-2xl max-lg:text-lg max-lg:px-5">
                    {props.commisionsCategories.map((commisionsCategories, number) => (
                        <Link to={props.linksCommisions[number]} className="flex flex-col w-1/3 pb-10 cursor-default max-lg:w-1/2 " >
                            <p className="font-semibold w-auto mx-auto hover:scale-110 duration-600 hover:text-[#FA6063] cursor-pointer " >{commisionsCategories}</p>
                        </Link>
                    ))}
                </div>

                {/* the decoration between the footer and the section up */}

                <img src="lineDecoration.svg" alt="decoration" className="absolute w-full bottom-0 translate-y-1/2" />

            </section>

            <Footer {...props.footer}></Footer>
        </main>
    );
}

