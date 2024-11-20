"use client";

import MonthlyGraphicCard from "@/components/MonthlyGraphicCard";
import { MONTHS, SEASONS } from "@/utils/constants";
import { Season } from "@/utils/types";
import { Card, Select } from "@rewind-ui/core";
import { NextPage } from "next";
import { useState } from "react";
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";

interface Props {
  params: { id: string };
}

const Dashboard: NextPage<Props> = ({ params }) => {
  const { id } = params;

  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [monthlyShown, setMonthlyShown] = useState<boolean>(false);

  const [season, setSeason] = useState<Season>("spring");
  const [seasonYear, setSeasonYear] = useState<number>(
    new Date().getFullYear()
  );
  const [seasonalShown, setSeasonalShown] = useState<boolean>(false);

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
          <div className="flex flex-row items-center text-darkPrimary gap-10">
            <div
              className="cursor-pointer text-darkPrimary -mr-8"
              onClick={() => {
                setMonthlyShown((prevState) => !prevState);
              }}
            >
              {monthlyShown ? <BiSolidDownArrow /> : <BiSolidRightArrow />}
            </div>
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
      {monthlyShown && (
        <div className="flex flex-row flex-wrap justify-center gap-10 my-10">
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
          <MonthlyGraphicCard
            graphic="monthlybanner"
            title="Monthly Bird Details Banner"
            downloadGraphic={downloadGraphic}
          />
        </div>
      )}
      <Card className="w-full rounded-none bg-gray-200">
        <Card.Body>
          <div className="flex flex-row items-center text-darkPrimary gap-10">
            <div
              className="cursor-pointer text-darkPrimary -mr-8"
              onClick={() => {
                setSeasonalShown((prevState) => !prevState);
              }}
            >
              {seasonalShown ? <BiSolidDownArrow /> : <BiSolidRightArrow />}
            </div>
            <span className="text-xl font-bold">Seasonal Bird Graphics</span>
            <div className="w-40">
              <Select
                defaultValue={season}
                onChange={(e) => setSeason(e.target.value as Season)}
                size="sm"
              >
                {SEASONS.map((season, idx) => (
                  <option key={idx} value={season}>
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-32">
              <Select
                defaultValue={seasonYear}
                onChange={(e) => setSeasonYear(Number(e.target.value))}
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
    </div>
  );
};

export default Dashboard;
