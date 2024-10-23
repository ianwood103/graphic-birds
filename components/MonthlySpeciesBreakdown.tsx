import { GraphicProps, SpeciesBreakdown } from "@/utils/types";
import { MONTHS } from "@/utils/constants";
import { downloadImage } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { Button } from "@rewind-ui/core";
import { MdOutlineFileDownload } from "react-icons/md";
import DoughnutChart from "./DoughnutChart";

const MonthlySpeciesBreakdown: React.FC<GraphicProps> = ({ data, month, year }) => {
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
      <div className="flex flex-row rounded-b-md bg-white p-2 w-full">
        <div className="w-full">
          <Button
            className="h-full w-full bg-primary"
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
