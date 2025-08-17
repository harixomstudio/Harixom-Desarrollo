interface loginProps {
    textbutton: string

}

export default function IndexPage(props: loginProps) {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <button className="py-2 px-25 text-sm font-semibold rounded-2xl bg-gradient-to-r from-pink-200 to-sky-200 shadow-md shadow-gray-300 hover:shadow-none transform hover:scale-95 duration-300"> {props.textbutton}</button>
        </div>
    )
}