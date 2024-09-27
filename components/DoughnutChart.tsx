// components/DoughnutChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { SpeciesBreakdown } from "@/utils/types";

interface DoughnutProps {
  breakdown: SpeciesBreakdown;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC<DoughnutProps> = ({ breakdown }) => {
  if (!breakdown) {
    return <span>No Data</span>;
  }

  const data = {
    labels: Object.keys(breakdown),
    datasets: [
      {
        label: "# of Votes",
        data: Object.values(breakdown),
        backgroundColor: [
          "#005B9E",
          "#1987D8",
          "#64A3D1",
          "#BAD6EA",
          "#D3F7CC",
          "#98C98E",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const legendOptions: ChartOptions<"doughnut"> = {
    maintainAspectRatio: false,
    cutout: "100%",
    radius: "50%",
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "#1987D8",
          font: {
            size: 8,
            family: "Arial",
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="flex flex-row h-full">
      <div className="w-7/12 h-full">
        <Doughnut className="max-w-full" data={data} options={chartOptions} />
      </div>
      <div className="w-5/12 h-full">
        <Doughnut className="max-w-full" data={data} options={legendOptions} />
      </div>
    </div>
  );
};

export default DoughnutChart;
