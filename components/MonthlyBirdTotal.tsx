import { ParsedData } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Select, Input, Button } from "@rewind-ui/core";
import { MdOutlineFileDownload } from "react-icons/md";
import domtoimage from "dom-to-image";

interface MonthlyBirdTotalProps {
  data: ParsedData[];
}

const MonthlyBirdTotal: React.FC<MonthlyBirdTotalProps> = ({ data }) => {
  const [total, setTotal] = useState<number>();
  const [mostCommonSpecies, setMostCommonSpecies] = useState<String | null>(
    null
  );
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(2024);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const elementRef = useRef<HTMLDivElement | null>(null);

  const downloadImage = () => {
    if (elementRef.current) {
      const scale = 3;
      const node = elementRef.current;

      domtoimage
        .toPng(node, {
          quality: 1.0,
          width: node.clientWidth * scale, // Adjust width based on scale factor
          height: node.clientHeight * scale, // Adjust height based on scale factor
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${node.clientWidth}px`,
            height: `${node.clientHeight}px`,
          },
        })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "element.png";
          link.click();
        })
        .catch((error) => {
          console.error("Could not generate image", error);
        });
    }
  };

  useEffect(() => {
    const fetchBirdTotal = async () => {
      const response = await fetch("/api/monthlybirdtotal", {
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
      setTotal(json.total);
      setMostCommonSpecies(json.mostCommonSpecies);
    };

    fetchBirdTotal();
  }, [data, month, year]);

  return (
    <div className="flex flex-col w-80 h-80 border-none shadow-sm">
      <div
        ref={elementRef}
        className="w-80 h-80 bg-white rounded-md box-shadow cursor-pointer hover:z-30 hover:bg-black"
      >
        <div className="flex flex-row w-full h-full bg-primary">
          <div className="flex flex-col items-center p-5 w-7/12">
            <div className="flex flex-row ml-2">
              <img src="/birds_ga.png" alt="" width={30} height={28}></img>
              <img src="/gt_logo.png" alt="" width={40} height={50}></img>
            </div>
            <span className="font-montserrat text-sm font-bold mt-6">
              {months[month]} {year}
            </span>
            <span className="font-montserrat text-[60px] font-bold -mt-3">
              {total}
            </span>
            <span className="font-montserrat text-sm font-bold mt-2 text-center">
              Collisions recorded by volunteers
            </span>
            {mostCommonSpecies && (
              <span className="font-montserrat text-[9px] font-thin mt-5 px-2 text-center">
                The most common bird found this month was the{" "}
                {mostCommonSpecies}.
              </span>
            )}
          </div>
          <div className="w-5/12">
            <img
              src="/bird_placeholder.png"
              alt=""
              width={1000}
              height={1000}
              className="h-full w-auto object-cover"
            ></img>
          </div>
        </div>
      </div>
      <div className="flex flex-row rounded-b-md bg-white p-2 w-full gap-2">
        <div className="w-1/2">
          <Select
            defaultValue={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            size="sm"
          >
            {months.map((monthLabel, idx) => (
              <option key={idx} value={idx}>
                {monthLabel}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-1/3">
          <Input
            size="sm"
            onChange={(e) => setYear(Number(e.target.value))}
            value={year}
            placeholder="Year"
          />
        </div>
        <div className="w-1/6">
          <Button className="h-full bg-primary" onClick={downloadImage}>
            <MdOutlineFileDownload className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBirdTotal;
