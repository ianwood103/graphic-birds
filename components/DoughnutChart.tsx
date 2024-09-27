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

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    layout: {
      padding: {
        bottom: -30,
      },
    },
    plugins: {
      legend: {
        position: "right",
        align: "center",
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

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
