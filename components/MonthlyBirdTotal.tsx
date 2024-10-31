import { GraphicProps } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@rewind-ui/core";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
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
  const graphicRef = useRef<HTMLDivElement | null>(null);

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
    <div className="flex flex-col w-[36rem] h-[36rem] border-none shadow-sm">
      {/* Main content */}
      <div
        ref={graphicRef}
        className="w-[36rem] h-[36rem] bg-white rounded-md box-shadow text-white flex flex-row justify-center relative"
      >
        <div className="absolute w-[36rem] h-[36rem] z-10">
          <img
            src={birdFilename}
            alt="Bird Placeholder"
            width={1000}
            height={1000}
            className="w-[36rem] h-[36rem] object-cover"
          />
        </div>
        <div className="flex flex-row w-10/12 h-full bg-[#005B9E] bg-opacity-65 z-20">
          <div className="flex flex-col items-center w-full h-full relative">
            {/* Date */}
            <span className="font-montserrat text-[23px] font-[400] leading-[48px]">
              {MONTHS[month].toUpperCase()} {year}
            </span>
            {/* Total collisions */}
            <span className="font-montserrat text-[123px] font-[700] mt-[50px]">
              {total}
            </span>
            <span className="font-montserrat text-[27px] font-[700] leading-tight text-center w-7/12 -mt-[10px]">
              Collisions recorded by volunteers
            </span>
            {/* Most common species */}
            {mostCommonSpecies && (
              <span className="font-montserrat text-[16px] font-[400] mt-[30px] leading-tight text-center w-7/12">
                The most common bird found this month was the{" "}
                {mostCommonSpecies}.
              </span>
            )}
            <div className="flex flex-row absolute bottom-0 left-1/2 -ml-[35px] mb-[15px]">
              <img
                src="/birds_ga.png"
                alt="Birds GA Logo"
                width={30}
                height={28}
              />
              <img src="/gt_logo.png" alt="GT Logo" width={40} height={50} />
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-row rounded-b-md bg-white p-2 w-full gap-2">
        <div className="w-1/2">
          <Button
            className="h-full w-full bg-primary"
            onClick={() => downloadImage(graphicRef)}
          >
            <MdOutlineFileDownload className="text-lg" />
          </Button>
        </div>
        <div className="flex flex-row w-1/2 gap-2 justify-center">
          <Button
            className="h-full w-1/4 bg-[#1DA1F2] px-0 py-2"
            onClick={() =>
              window.open("https://twitter.com/intent/tweet", "_blank")
            }
          >
            <FaTwitter className="text-lg" />
          </Button>
          <Button
            className="h-full w-1/4 bg-[#0077b5] px-0 py-2"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/sharing/share-offsite/",
                "_blank"
              )
            }
          >
            <FaLinkedin className="text-lg" />
          </Button>
          <Button
            className="h-full w-1/4 bg-[#4267B2] px-0 py-2"
            onClick={() =>
              window.open(
                "https://www.facebook.com/sharer/sharer.php",
                "_blank"
              )
            }
          >
            <FaFacebook className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBirdTotal;
