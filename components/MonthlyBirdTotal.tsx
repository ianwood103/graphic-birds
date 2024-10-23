import { GraphicProps } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@rewind-ui/core";
import { MdOutlineFileDownload } from "react-icons/md";
import { MONTHS } from "@/utils/constants";
import { downloadImage, getBirdFilename } from "@/utils/helpers";

const MonthlyBirdTotal: React.FC<GraphicProps> = ({ data, month, year }) => {
  // State variables
  const [total, setTotal] = useState<number>(0);
  const [mostCommonSpecies, setMostCommonSpecies] = useState<string | null>(
    null
  );
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
      <div className="flex flex-row rounded-b-md bg-white p-2 w-full">
        <div className="w-full">
          <Button
            className="h-full w-full bg-primary"
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
