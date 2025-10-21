import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardProps{
    followers:number,
    following: number,
    publications: number,
    likes: number,
}

export default function DashboardPage({ followers, following, publications, likes }: DashboardProps) {
  const data = {
    labels: ['Followers', 'Following', 'Publications', 'Likes'],
    datasets: [
      {
        label: "Cantidad",
        data: [followers, following, publications, likes],
        backgroundColor: ['#F778BD', '#8936D2', '#96E2FF', '#FFEA00'],
        borderColor: ['#F778BD', '#8936D2', '#96E2FF', '#FFEA00'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      }
    },
  };

  return (
    <div className="rounded-lg shadow-lg mb-11 max-w-screen-lg w-full mx-auto">
      <h1 className="text-white text-3xl lg:text-4xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="text-center">
        <span className="text-gray-300 text-lg">Estadísticas del Usuario</span>
      </div>
      <div className="h-[500px] w-full mt-8">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}