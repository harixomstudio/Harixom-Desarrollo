import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  followers: number;
  following: number;
  publications: number;
  likes: number;
}

export default function DashboardLastThreeMonthsPage({
  followers,
  following,
  publications,
  likes,
}: DashboardProps) {
  const data = {
    labels: ["Followers", "Following", "Publications", "Likes"], // Ejes X
    datasets: [
      {
        label: "Últimos 3 meses",
        data: [followers, following, publications, likes], // Ejes Y
        borderColor: "#F778BD",
        backgroundColor: "rgba(247, 120, 189, 0.2)",
        pointBackgroundColor: "#F778BD",
        pointBorderColor: "#F778BD",
        borderWidth: 2,
        tension: 0.4, // Suaviza las líneas
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    
  };

  return (
    <div
      className="rounded-lg shadow-lg mb-11 max-w-screen-lg w-full mx-auto"
      style={{ fontFamily: "Montserrat" }}
    >
      <div className="text-center">
        <span className="text-gray-300 text-lg">User statistics (Last 3 months)</span>
      </div>
      <div className="h-[500px] w-full mt-8">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}