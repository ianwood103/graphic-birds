import { GraphicProps, SpeciesBreakdown } from "@/utils/types";
import { MONTHS } from "@/utils/constants";
import { downloadImage } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { Select, Button } from "@rewind-ui/core";
import { MdOutlineFileDownload } from "react-icons/md";
import DoughnutChart from "./DoughnutChart";

const MonthlySpeciesBreakdown: React.FC<GraphicProps> = ({ data }) => {
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [breakdown, setBreakdown] = useState<SpeciesBreakdown>(null);

  const graphicRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchSpeciesBreakdown = async () => {
      const response = await fetch("/api/monthlyspeciesbreakdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          month,
          year,
        }),
      });

      const json = await response.json();
      setBreakdown(json.breakdown);
    };

    fetchSpeciesBreakdown();
  }, [data, month, year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  return (
    <div className="flex flex-col w-80 h-80 border-none shadow-sm">
      <div
        ref={graphicRef}
        className="flex flex-row w-80 min-h-80 bg-white p-4 relative text-right"
      >
        <div className="flex flex-col">
          <img src="/birds_ga.png" alt="" width={30} height={28}></img>
          <DoughnutChart breakdown={breakdown} />
        </div>
        <span className="text-primary font-bold text-[24px] absolute top-4 right-4 w-2/3">
          Bird-Building Collisions by Species
        </span>
        <div className="flex flex-row justify-center text-center w-[40px] absolute left-20 bottom-[112px]">
          <span className="text-primary font-bold text-[15px]">
            {MONTHS[month]} {year}
          </span>
        </div>
      </div>
      <div className="flex flex-row rounded-b-md bg-white p-2 w-full gap-2 z-10">
        <div className="w-1/2">
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
        <div className="w-1/3">
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
        <div className="w-1/6">
          <Button
            className="h-full bg-primary"
            onClick={() => downloadImage(graphicRef)}
          >
            <MdOutlineFileDownload className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthlySpeciesBreakdown;
