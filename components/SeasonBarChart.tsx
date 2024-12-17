"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { SpeciesBreakdown } from "@/utils/types";

ChartJS.register(...registerables);

interface BarChartProps {
  breakdown: SpeciesBreakdown;
  portrait?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ breakdown, portrait = false }) => {
  if (!breakdown) {
    return <span>No Data</span>;
  }

  const colors = [
    "#D3F7CC",
    "#C3EDCD",
    "#B1E3CE",
    "#A1D8CF",
    "#90CED0",
    "#7EC4D1",
    "#6EBAD3",
    "#4CA6D5",
    "#3C9BD6",
    "#2991D7",
    "#1A87D8",
  ];

  const data = {
    labels: ["Total Birds"], // A single category for all bird types
    datasets: Object.entries(breakdown)
      .reverse()
      .map(([label, data], index) => ({
        label,
        data: [data], // Replace with actual count
        backgroundColor: colors[index % colors.length], // Assign color based on index
        borderColor: "transparent", // Changed border color to transparent
        borderWidth: 6, // Changed border width to 8
        barPercentage: portrait ? 1.2 : 1, // Adjusted bar percentage to make bars narrower
        borderRadius: 0, // Set border radius to 0 to make bars not rounded
      })),
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "x", // Make the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        stacked: true, // Enable stacking for x-axis
        grid: {
          display: false, // Remove grid lines on x-axis
        },
        ticks: {
          display: false,
        },
        display: false,
      },
      y: {
        stacked: true, // Enable stacking for y-axis
        grid: {
          display: false, // Remove grid lines on y-axis
        },
        ticks: {
          display: false,
        },
        display: false,
      },
    },
    plugins: {
      legend: {
        position: "right",
        align: portrait ? "center" : "end",
        labels: {
          usePointStyle: true, // Use circles for legend points
          pointStyle: "circle", // Specify circle as the point style
          boxHeight: 10,
          color: "#FFFFFF", // Set legend text color to white
          padding: portrait ? 30 : 10,
          font: {
            size: 20, // Increase font size of legend
          },
        },
        display: true,
        reverse: true, // Reverse the order of the legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    animation: {
      duration: 0, // Disable animations
    },
    layout: {
      padding: {
        top: 0,
        bottom: 0,
        left: -500,
        right: 100,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
