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
    <div className="bg-black min-h-screen p-6 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">{taller.title}</h1>
      <img
        src={
          taller.image ||
          "https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_960_720.jpg"
        }
        alt={taller.title}
        className="w-full max-w-2xl h-auto mb-6 rounded-lg"
      />
      <p className="text-gray-300 mb-4">{taller.description}</p>
      <div className="text-gray-400 space-y-2 text-lg">
        <p>
          <strong>Lugar:</strong> {taller.place}
        </p>
        <p>
          <strong>Fecha:</strong> {taller.dateStart}{" "}
          <strong>Hora:</strong> {taller.timeStart}
        </p>
        {taller.duration && (
          <p>
            <strong>Duración:</strong> {taller.duration}
          </p>
        )}
        {taller.contributor && (
          <p>
            <strong>Impartido por:</strong> {taller.contributor}
          </p>
        )}
      </div>
    </div>
  );
}