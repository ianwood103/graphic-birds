"use client";

import { MONTHS } from "@/utils/constants";
import { Button, Select } from "@rewind-ui/core";
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
    const searchParams = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });
    const url = `https://visual-birds.vercel.app/${graphic}/${id}?${searchParams.toString()}`;
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
      <div className="flex flex-row gap-2 mb-8 pt-4">
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
      <div className="flex flex-row">
        <Button onClick={() => downloadGraphic("monthlybirdtotal")}>
          Monthly Bird Total
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
