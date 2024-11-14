"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { SpeciesBreakdown } from "@/utils/types";

ChartJS.register(...registerables);

interface BarChartProps {
  breakdown: SpeciesBreakdown;
}

const BarChart: React.FC<BarChartProps> = ({ breakdown }) => {
  if (!breakdown) {
    return <span>No Data</span>;
  }

  const colors = [
    "#1A87D8",
    "#3C9BD6",
    "#6EBAD3",
    "#90CED0",
    "#A1D8CF",
    "#D3F7CC",
  ];

  const data = {
    labels: ["Total Birds"], // A single category for all bird types
    datasets: Object.entries(breakdown).map(([label, data], index) => ({
      label,
      data: [data], // Replace with actual count
      backgroundColor: colors[index % colors.length], // Assign color based on index
      borderColor: "transparent", // Changed border color to transparent
      borderWidth: 6, // Changed border width to 8
      barPercentage: 0.85, // Adjusted bar percentage to make bars narrower
      borderRadius: 0, // Set border radius to 0 to make bars not rounded
    })),
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y", // Make the bar chart horizontal
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
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true, // Use circles for legend points
          pointStyle: "circle", // Specify circle as the point style
          boxHeight: 10,
          color: "#FFFFFF", // Set legend text color to white
          padding: 10,
          font: {
            size: 20, // Increase font size of legend
          },
        },
        display: true,
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
        bottom: 30,
        left: 30,
        right: 30,
      },
      autoPadding: true,
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
