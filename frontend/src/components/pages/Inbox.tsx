
import { useEffect, useState } from "react"

interface NotificationsProps {
    prioritys: string[]
    notification: string
    titles: string[]
    users: string[]
    UsersID: number[]
    texts: string[]
    dates: string[]
    images: string[]
    alts: string[]
}

export default function Notifications(props: NotificationsProps) {
    const styles = props.prioritys.map((_, number) => props.prioritys[number] === 'High' ? 'border-l-red-400' : props.prioritys[number] === 'Medium' ? 'border-l-yellow-500' : props.prioritys[number] === 'Low' ? 'border-l-blue-500' : '')
    props.images.map((_, number) => props.prioritys[number] === 'High' ? props.images[number] = 'bellPink.svg' : props.prioritys[number] === 'Medium' ? props.images[number] = 'bellYellow.svg' : props.prioritys[number] === 'Low' ? props.images[number] = 'bellBlue.svg' : '')
    const [visibleCount, setVisibleCount] = useState(9);

    useEffect(() => { //Despliegue de un feed infinito, scroll aparece cargando y aumentan las notificaciones
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
                setVisibleCount((prevCount) => prevCount + 9);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };



    }, [visibleCount]);
    return (
        <section className={`flex flex-col w-full py-10 gap-10 items-center bg-stone-950 text-white ${visibleCount < props.titles.length ? 'h-full' : 'min-h-screen'}`} style={{ fontFamily: "Montserrat" }}>
            <h1 className=" text-4xl min-lg:text-6xl font-medium cursor-default font-startruc text-pink-500">{props.notification}</h1>

            {props.titles.slice(0, visibleCount).map((_, number) => (

                <div className={`flex border-1 border-l-6 ${styles[number]} items-center w-6/7 border-gray-300 gap-8 rounded-2xl py-5 bg-stone-900 overflow-hidden`}>
                    <img className=" w-8 min-md:w-8 m-5 min-lg:m-10" src={props.images[number]} alt={props.alts[number]} />
                    <div className="grid grid-cols-1 gap-2 w-3/4 justify-center items-center">
                        <h1 className=" text-1xl font-semibold cursor-default"> {props.titles[number]} </h1>
                        <h2>De: <a href={`/ProfileGuest?userId=${props.UsersID[number]}`} className=" hover:text-pink-400 duration-500  animate-pulse [animation-duration:5s]"> {props.users[number]}</a></h2>
                        <p className="max-lg:text-sm max-lg:line-clamp-3"> {props.texts[number]} </p>
                        <p className=""> {props.dates[number]} </p>
                    </div>
                </div>
            ))}
            {visibleCount < props.titles.length ? ( // esto es el loading se activa al scrollear
                <div className="flex justify-center pt-10 pb-15">
                    <div className="flex space-x-3">
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            ) : <div className="flex space-x-1 text-gray-400 text-sm justify-center items-baseline pt-10 "> ESPERANDO NOTIFICACIONES 
                <p className="animate-pulse [animation-delay:-0.8s] text-2xl pl-1">.</p>
                <p className="animate-pulse [animation-delay:-0.3s] text-2xl">.</p>
                <p className="animate-pulse text-2xl" >.</p>
            </div>}
        </section>
    )
}