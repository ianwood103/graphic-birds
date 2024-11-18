"use client";

import MonthlyGraphicCard from "@/components/MonthlyGraphicCard";
import { MONTHS } from "@/utils/constants";
import { Card, Select } from "@rewind-ui/core";
import { NextPage } from "next";
import { useState } from "react";

interface Props {
  params: { id: string };
}

const Dashboard: NextPage<Props> = ({ params }) => {
  const { id } = params;

  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  const downloadGraphic = async (graphic: string) => {
    const isProduction = process.env.NODE_ENV === "production";
    const searchParams = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });
    const url = `${
      isProduction ? "https://visual-birds.vercel.app" : "http://localhost:3000"
    }/${graphic}/${id}?${searchParams.toString()}`;
    const selector = `#${graphic}`;

    const response = await fetch("/api/screenshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, selector }),
    });

    const { downloadUrl } = await response.json();
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = `${graphic}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <Card className="w-full rounded-none bg-gray-200">
        <Card.Body>
          <div className="flex flex-row text-darkPrimary gap-10">
            <span className="text-xl font-bold">Monthly Bird Graphics</span>
            <div className="w-40">
              <Select
                defaultValue={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                size="sm"
              >
                {MONTHS.map((monthLabel, idx) => (
                  <option key={idx} value={idx}>
                    {monthLabel}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-32">
              <Select
                defaultValue={year}
                onChange={(e) => setYear(Number(e.target.value))}
                size="sm"
              >
                {years.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card.Body>
      </Card>
      <div className="flex flex-row flex-wrap justify-center gap-10 mt-10">
        <MonthlyGraphicCard
          graphic="monthlybirdtotal"
          title="Monthly Bird Total (Instagram)"
          downloadGraphic={downloadGraphic}
        />
        <MonthlyGraphicCard
          graphic="monthlyspeciesbreakdown"
          title="Monthly Species Breakdown (Instagram)"
          downloadGraphic={downloadGraphic}
        />
        <MonthlyGraphicCard
          graphic="monthlymapview"
          title="Monthly Map View (Instagram)"
          downloadGraphic={downloadGraphic}
        />
        <MonthlyGraphicCard
          graphic="monthlybirdtotalv2"
          title="Monthly Map View (Instagram Story)"
          downloadGraphic={downloadGraphic}
        />
        <MonthlyGraphicCard
          graphic="monthlyspeciesbreakdownv2"
          title="Monthly Species Breakdown (Instagram Story)"
          downloadGraphic={downloadGraphic}
        />
        <MonthlyGraphicCard
          graphic="monthlymapviewv2"
          title="Monthly Map View (Instagram Story)"
          downloadGraphic={downloadGraphic}
        />
      </div>
    </div>
  );
};

export default Dashboard;
