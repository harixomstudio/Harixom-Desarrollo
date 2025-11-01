
import { useEffect, useMemo, useState } from "react"

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
    props.images.map((_, number) => props.prioritys[number] === 'High' ? props.images[number] = 'bellPink.svg' : props.prioritys[number] === 'Medium' ? props.images[number] = 'bellYellow.svg' : props.prioritys[number] === 'Low' ? props.images[number] = 'bellBlue.svg' : '')
    const [visibleCount, setVisibleCount] = useState(9);
    const [filter, setFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all')
    const [order, setOrder] = useState<'priority' | 'time'>('priority')


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




    const combinedNotifications = props.titles.map((title, index) => ({
        title,
        user: props.users[index],
        userId: props.UsersID[index],
        text: props.texts[index],
        date: props.dates[index],
        priority: props.prioritys[index],
        image: props.images[index],
        alt: props.alts[index],
    }));
    type Priority = "High" | "Medium" | "Low"
    const priorityOrder: Record<Priority, number> = { High: 1, Medium: 2, Low: 3 };

    const sortedNotifications = useMemo(() => {
        // Filtrar primero
        const filtered =
            filter === "all"
                ? combinedNotifications
                : combinedNotifications.filter((n) => n.priority === filter);

        const sorted = [...filtered].sort((a, b) => {
            if (order === "priority") {
                return priorityOrder[a.priority as Priority] - priorityOrder[b.priority as Priority];
            } else if (order === "time") {
                return parseTime(a.date) - parseTime(b.date);
            }
            return 0;
        });

        return sorted;
    }, [combinedNotifications, filter, order]);
    function parseTime(diff: string): number {
        const lower = diff.toLowerCase();
        if (lower.includes("minutes")) {
            const num = parseInt(lower);
            return num * 60 * 1000;
        } else if (lower.includes("hour")) {
            const num = parseInt(lower);
            return num * 60 * 60 * 1000;
        } else if (lower.includes("day")) {
            const num = parseInt(lower);
            return num * 24 * 60 * 60 * 1000;
        } else if (lower.includes("week")) {
            const num = parseInt(lower);
            return num * 7 * 24 * 60 * 60 * 1000;
        }
        return 0;
    }

    return (
        <section className={`flex flex-col w-full py-10 gap-10 items-center bg-stone-950 text-white ${visibleCount < props.titles.length ? 'h-full' : 'min-h-screen'}`} style={{ fontFamily: "Montserrat" }}>
            <div className="flex justify-evenly w-full">
                <button className="rounded-3xl bg-gradient-to-r from-green-500 to-teal-700 hover:shadow-lg px-6 py-1 cursor-pointer duration-500 hover:scale-110 font-semibold" onClick={() => { setFilter("all"), setOrder("priority") }}> All Priority</button>
                <button className="rounded-3xl bg-gradient-to-r from-purple-500 to-fuchsia-700  hover:shadow-lg px-6 py-1 cursor-pointer duration-500 hover:scale-110 font-semibold" onClick={() => { setFilter("all"), setOrder("time") }}> Time</button>

            </div>
            <div className="flex justify-around w-full">
                <button className="rounded-3xl bg-gradient-to-r from-pink-400 to-red-500 hover:shadow-lg px-6 py-1 cursor-pointer duration-500 hover:scale-110 font-semibold" onClick={() => setFilter('High')}>High</button>
                <button className="rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-600 hover:shadow-lg px-6 py-1 cursor-pointer duration-500 hover:scale-110 font-semibold" onClick={() => setFilter("Medium")}>Medium</button>
                <button className="rounded-3xl bg-gradient-to-r from-sky-300 to-blue-500 hover:shadow-lg px-6 py-1 cursor-pointer duration-500 hover:scale-110 font-semibold" onClick={() => setFilter("Low")}>Low</button>
            </div>
            <h1 className=" text-4xl min-lg:text-6xl font-medium cursor-default font-startruc text-pink-500">{props.notification}</h1>
            {sortedNotifications.slice(0, visibleCount).map((noti, index) => (
                <div
                    key={index}
                    className={`flex border-1 border-l-6 ${noti.priority === "High"
                        ? "border-l-red-400"
                        : noti.priority === "Medium"
                            ? "border-l-yellow-500"
                            : "border-l-blue-500"
                        } items-center w-6/7 border-gray-300 gap-8 rounded-2xl py-5 bg-stone-900 overflow-hidden`}
                >
                    <img className="w-8 min-md:w-8 m-5 min-lg:m-10" src={noti.image} alt={noti.alt} />
                    <div className="grid grid-cols-1 gap-2 w-3/4 justify-center items-center">
                        <h1 className="text-1xl font-semibold cursor-default">{noti.title}</h1>
                        <h2>
                            From:{" "}
                            <a
                                href={`/ProfileGuest?userId=${noti.userId}`}
                                className="hover:text-pink-400 duration-500 animate-pulse [animation-duration:5s]"
                            >
                                {noti.user}
                            </a>
                        </h2>
                        <p className="max-lg:text-sm max-lg:line-clamp-3">{noti.text}</p>
                        <p>{noti.date}</p>
                    </div>
                </div>
            ))}

            {visibleCount < sortedNotifications.length ? (
                <div className="flex justify-center pt-10 pb-15">
                    <div className="flex space-x-3">
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            ) : (
                <div className="flex space-x-1 text-gray-400 text-sm justify-center items-baseline pt-10">
                    WAITING FOR NEW NOTIFICATIONS
                    <p className="animate-pulse [animation-delay:-0.8s] text-2xl pl-1">.</p>
                    <p className="animate-pulse [animation-delay:-0.3s] text-2xl">.</p>
                    <p className="animate-pulse text-2xl">.</p>
                </div>
            )}
        </section>
    );
}