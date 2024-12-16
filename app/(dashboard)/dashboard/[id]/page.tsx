"use client";

import MonthlyGraphicCard from "@/components/MonthlyGraphicCard";
import SeasonGraphicCard from "@/components/SeasonGraphicCard";
import { MONTHS, SEASONS } from "@/utils/constants";
import { Season } from "@/utils/types";
import { Card, Select } from "@rewind-ui/core";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";

interface Props {
  params: { id: string };
}

const Dashboard: NextPage<Props> = ({ params }) => {
  const { id } = params;

  const [downloading, setDownloading] = useState<boolean>(false);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [monthlyShown, setMonthlyShown] = useState<boolean>(false);
  const [birdCount, setBirdCount] = useState<number>(0);

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

  const downloadGraphic = async (graphic: string, monthly: boolean = true) => {
    const isProduction = process.env.NODE_ENV === "production";
    let searchParams;
    if (monthly) {
      searchParams = new URLSearchParams({
        year: year.toString(),
        month: month.toString(),
      });
    } else {
      searchParams = new URLSearchParams({
        year: seasonYear.toString(),
        season: season.toString(),
      });
    }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/birds/${id}?month=${month}&year=${year}`
        );
        const data = await response.json();
        setBirdCount(data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [month, year, id]);

  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <Card className="w-full rounded-none bg-gray-200">
        <Card.Body>
          <div className="flex flex-row items-center text-darkPrimary gap-10 justify-between w-full">
            <div className="flex flex-row items-center gap-10">
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
            <div
              className={`text-xl font-bold ${
                birdCount < 5 ? "text-red-500" : ""
              }`}
            >
              Birds Found: {birdCount}
            </div>
          </div>
        </Card.Body>
      </Card>
      {monthlyShown && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 my-10 max-w-7xl mx-auto">
          <MonthlyGraphicCard
            graphic="monthlybirdtotal"
            title="Monthly Bird Total"
            downloadGraphic={downloadGraphic}
            month={month}
            year={year}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <MonthlyGraphicCard
            graphic="monthlyspeciesbreakdown"
            title="Monthly Species Breakdown"
            downloadGraphic={downloadGraphic}
            month={month}
            year={year}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <MonthlyGraphicCard
            graphic="monthlymapview"
            title="Monthly Map View"
            downloadGraphic={downloadGraphic}
            month={month}
            year={year}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <MonthlyGraphicCard
            graphic="monthlybirdtotalv2"
            title="Monthly Map View"
            downloadGraphic={downloadGraphic}
            month={month}
            year={year}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <MonthlyGraphicCard
            graphic="monthlyspeciesbreakdownv2"
            title="Monthly Species Breakdown"
            downloadGraphic={downloadGraphic}
            month={month}
            year={year}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <MonthlyGraphicCard
            graphic="monthlymapviewv2"
            title="Monthly Map View"
            downloadGraphic={downloadGraphic}
            month={month}
            year={year}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <MonthlyGraphicCard
            graphic="monthlybanner"
            title="Monthly Bird Details Banner"
            downloadGraphic={downloadGraphic}
            month={month}
            year={year}
            downloading={downloading}
            setDownloading={setDownloading}
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
      {seasonalShown && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 my-10 max-w-7xl mx-auto">
          <SeasonGraphicCard
            graphic="seasonrecap"
            title="Season Recap"
            downloadGraphic={downloadGraphic}
            season={season}
            year={seasonYear}
            downloading={downloading}
            setDownloading={setDownloading}
          />
          <SeasonGraphicCard
            graphic="seasontotal"
            title="Season Total"
            downloadGraphic={downloadGraphic}
            season={season}
            year={seasonYear}
            downloading={downloading}
            setDownloading={setDownloading}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
