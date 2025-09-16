import { useState } from "react";

interface CreateActivityProps {
    Event: string;
    Type: string;
    AllTypes: string[];

    dateStart: string;
    timeStart: string;

    title: string;
    description: string;

    dateEnd: string;
    timeEnd: string;
}

export default function CreateActivity(props: CreateActivityProps) {
    const [type, setType] = useState("");
    return (
        <main className="w-full h-full bg-[#131313] text-white flex flex-col items-center p-25 ">
            <section className="w-full h-full bg-[#2c2c2c] rounded-[4rem] p-30 flex flex-col ">

                <h1 className="text-8xl font-semibold mb-15 ">{props.Event}</h1>

                <h3 className="mb-4 text-4xl font-semibold ">{props.Type}</h3>
                <select className="mb-10 border-b-2 p-3 text-2xl outline-none" name="Type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled className="bg-[#2c2c2c] text-2xl">
                        Select a Type
                    </option>
                    {props.AllTypes.map((type, i) => (
                        <option key={i} value={type} className="bg-[#474747] text-2xl rounded-2xl">{type}</option>
                    ))}
                </select>

                <div className="columns-2 mb-10">
                    <h3 className="w-1/2 mb-4 text-4xl font-semibold ">{props.dateStart} </h3>
                    <input className="w-1/2 mb-10 border-b-2 p-3 text-3xl outline-none" type="date" />

                    <h3 className="w-1/2 mb-4 text-4xl font-semibold ">{props.timeStart}</h3>
                    <input className="w-1/2 mb-10 border-b-2 p-3 text-3xl outline-none" type="time" />
                </div>

                <h3 className="mb-4 text-4xl font-semibold ">{props.title}</h3>
                <input className="mb-10 border-b-2 p-3 text-3xl outline-none" type="text" />

                <h3 className="mb-4 text-4xl font-semibold ">{props.description}</h3>
                <input className="mb-10 border-b-2 p-3 text-3xl outline-none" type="text" />

                <div className="columns-2 mb-10 text-2xl">
                    <h3 className="w-1/2 mb-4 text-4xl font-semibold ">{props.dateEnd} </h3>
                    <input className="w-1/2 mb-10 border-b-2 p-3 text-3xl outline-none" type="date" />

                    <h3 className="w-1/2 mb-4 text-4xl font-semibold ">{props.timeEnd}</h3>
                    <input className="w-1/2 mb-10 border-b-2 p-3 outline-none" type="time" />
                </div>

                <button type="submit" className="text-4xl bg-[#48e1ec] w-1/4 hover:bg-[#3ab9c2] duration-400 text-black font-semibold py-4 px-6 rounded-xl">Create Activity</button>
            </section>
        </main>
    );
}