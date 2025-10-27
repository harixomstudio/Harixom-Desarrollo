interface Taller {
  id: number;
  image?: string;
  title: string;
  description: string;
  place: string;
  dateStart: string;
  timeStart: string;
  duration?: string;
  contributor?: string;
}

interface TallerDetailPageProps {
  taller: Taller;
}

export default function TallerDetailPage({ taller }: TallerDetailPageProps) {
  return (
    <main className="bg-black min-h-screen p-6 text-white flex flex-col items-center"
    style={{ fontFamily: "Monserrat" }}>
      <a href="/Workshops" className="text-white mb-8 mr-auto bg-gradient-to-r from-pink-400 to-sky-400 hover:scale-110 transform duration-300 px-15 py-2 rounded-4xl max-lg:hidden">Back</a>
      <div className="flex flex-col items-center border-2 border-gray-600 rounded-2xl p-6 bg-stone-900">
        <h1 className="text-4xl max-lg:text-2xl font-bold mb-4">{taller.title}</h1>
        <img
          src={
            taller.image ||
            "https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_960_720.jpg"
          }
          alt={taller.title}
          className="w-full max-w-2xl h-auto mb-6 rounded-lg"
        />
        <div className="text-gray-400 space-y-2 text-lg  text-start flex flex-col w-full">
          <p><strong>Lugar:</strong> {taller.place} </p>
          <p><strong>Fecha:</strong> {taller.dateStart}{" "}<strong>Hora:</strong> {taller.timeStart} </p>
          {taller.duration && (
            <p><strong>Duración:</strong> {taller.duration} </p>
          )}
          {taller.contributor && (
            <p> <strong>Impartido por:</strong> {taller.contributor} </p>
          )}
        </div>
        <p className="text-gray-300 mt-4 text-lg text-start flex flex-col w-full"><span className="font-bold flex">Description:</span> {taller.description}</p>
      </div>
      <a href="/Workshops" className="text-white mt-8 mr-auto bg-gradient-to-r from-pink-400 to-sky-400 hover:scale-110 transform duration-300 px-15 py-2 rounded-4xl lg:hidden">Back</a>

    </main>
  );
}