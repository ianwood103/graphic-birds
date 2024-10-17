import { GraphicProps } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { Select, Button } from "@rewind-ui/core";
import { MdOutlineFileDownload } from "react-icons/md";
import { MONTHS } from "@/utils/constants";
import { downloadImage, getBirdFilename } from "@/utils/helpers";

const MonthlyBirdTotal: React.FC<GraphicProps> = ({ data }) => {
  // State variables
  const [total, setTotal] = useState<number>(0);
  const [mostCommonSpecies, setMostCommonSpecies] = useState<string | null>(
    null
  );
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [birdFilename, setBirdFilename] = useState<string>(
    "/bird_placeholder.png"
  );

  // Ref for the element to be captured as an image
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Fetch bird total data when month, year, or data changes
  useEffect(() => {
    const fetchBirdTotal = async () => {
      try {
        const response = await fetch("/api/monthlybirdtotal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, month, year }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bird total");
        }

        const json = await response.json();
        setTotal(json.total);
        setMostCommonSpecies(json.mostCommonSpecies);
        const filename = getBirdFilename(json.mostCommonSpecies);
        setBirdFilename(filename);
      } catch (error) {
        console.error("Error fetching bird total:", error);
      }
    };

    fetchBirdTotal();
  }, [data, month, year]);

  // Generate array of years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  return (
    <div className="flex flex-col w-80 h-80 border-none shadow-sm">
      {/* Main content */}
      <div
        ref={elementRef}
        className="w-80 h-80 bg-white rounded-md box-shadow cursor-pointer text-white"
      >
        <div className="flex flex-row w-full h-full bg-primary">
          {/* Left column */}
          <div className="flex flex-col items-center p-5 w-7/12">
            {/* Logos */}
            <div className="flex flex-row ml-2">
              <img
                src="/birds_ga.png"
                alt="Birds GA Logo"
                width={30}
                height={28}
              />
              <img src="/gt_logo.png" alt="GT Logo" width={40} height={50} />
            </div>
            {/* Date */}
            <span className="font-montserrat text-sm font-bold mt-6">
              {MONTHS[month]} {year}
            </span>
            {/* Total collisions */}
            <span className="font-montserrat text-[60px] font-bold -mt-3">
              {total}
            </span>
            <span className="font-montserrat text-sm font-bold mt-2 text-center">
              Collisions recorded by volunteers
            </span>
            {/* Most common species */}
            {mostCommonSpecies && (
              <span className="font-montserrat text-[9px] font-thin mt-5 px-2 text-center">
                The most common bird found this month was the{" "}
                {mostCommonSpecies}.
              </span>
            )}
          </div>
          {/* Right column (image) */}
          <div className="w-5/12">
            <img
              src={birdFilename}
              alt="Bird Placeholder"
              width={1000}
              height={1000}
              className="h-full w-auto object-cover"
            />
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-row rounded-b-md bg-white p-2 w-full gap-2">
        {/* Month selector */}
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
        {/* Year selector */}
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
        {/* Download button */}
        <div className="w-1/6">
          <Button
            className="h-full bg-primary"
            onClick={() => downloadImage(elementRef)}
          >
            <MdOutlineFileDownload className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBirdTotal;
