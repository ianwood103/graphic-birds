import type { NextPage } from "next";
import { Coordinate, ParsedData, SpeciesBreakdown } from "@/utils/types";
import { MONTHS } from "@/utils/constants";
import { getBirdFilename, getData } from "@/utils/helpers";
import Image from "next/image";
import dynamic from "next/dynamic";
import BarChartV2 from "@/components/BarChartV2";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    month?: string;
  };
}

const MonthlyBannerPage: NextPage<Props> = async ({ params, searchParams }) => {
  const { id } = params;
  const month = parseInt(searchParams.month || "0", 10);
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { total, mostCommonSpecies } = await processTotalData(
    data,
    year,
    month
  );

  const { breakdown } = await processBreakdownData(data, year, month);

  const { coordinates } = await processMapData(data, year, month);

  const filename = mostCommonSpecies
    ? getBirdFilename(mostCommonSpecies)
    : "/bird_placeholder.png";

  return (
    <div
      className="w-[64rem] h-[36rem] flex flex-row bg-white box-shadow text-white justify-center relative overflow-hidden"
      id="monthlybanner"
    >
      <div className="w-1/3 h-[36rem] z-10">
        <Image
          src={filename}
          alt="Bird Placeholder"
          width={1000}
          height={1000}
          className="w-full h-[36rem] object-cover"
        />
      </div>
      <div className="w-1/3 flex flex-row h-full bg-darkPrimary z-20">
        <div className="flex flex-col items-center w-full h-full relative">
          {/* Date */}
          <span className="font-montserrat text-[18px] font-[400] leading-[48px]">
            {MONTHS[month].toUpperCase()} {year}
          </span>
          {/* Total collisions */}
          <span className="font-montserrat text-[90px] font-[700] mt-[10px]">
            {total}
          </span>
          <span className="font-montserrat text-[22px] font-[700] leading-tight text-center w-9/12 -mt-[10px]">
            Collisions recorded by volunteers
          </span>
          {/* Most common species */}
          {mostCommonSpecies && (
            <span className="font-montserrat text-[14px] font-[400] mt-[20px] leading-tight text-center w-11/12">
              The most common bird found this month was the {mostCommonSpecies}.
            </span>
          )}
          <div className="mt-6">
            <BarChartV2 breakdown={breakdown} />
          </div>
          <div className="flex flex-row absolute bottom-0 left-1/2 -ml-[35px] mb-[15px] gap-2">
            <Image
              src="/birds_ga.png"
              alt="Birds GA Logo"
              width={30}
              height={28}
            />
            <Image src="/gt_logo.png" alt="GT Logo" width={40} height={28} />
          </div>
        </div>
      </div>
      <div className="w-1/3 h-[36rem] relative">
        <MapView coordinates={coordinates} center={[33.791, -84.384]} />
        <div className="w-32 h-20 flex flex-col items-center absolute top-[4.3rem] left-[9.5rem] z-20">
          <div className="outline-dotted w-10/12 h-full outline-black outline-2 z-20"></div>
          <span className="text-primary text-sm">Buckhead Route</span>
        </div>
        <div className="w-36 h-20 flex flex-col items-center absolute top-[18.3rem] left-[3rem] z-20">
          <span className="text-primary text-sm">Georgia Tech Route</span>
          <div className="outline-dotted w-6/12 h-full outline-black outline-2 z-20"></div>
        </div>
        <div className="w-32 h-24 flex flex-col items-center absolute top-[23.8rem] left-[6rem] z-20">
          <div className="outline-dotted w-8/12 h-full outline-black outline-2 z-20"></div>
          <span className="text-primary text-sm">Downtown Route</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBannerPage;

const processTotalData = async (
  data: ParsedData[],
  year: number,
  month: number
) => {
  if (!data) {
    return { total: 0, mostCommonSpecies: "Unknown" };
  }
  let total = 0;
  const speciesCount: { [key: string]: number } = {};
  data.forEach((item: ParsedData) => {
    const { Date: date, Species: species } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    if (month == parseInt(currentMonth) && year == parseInt(currentYear)) {
      total += 1;
      if (speciesCount[species] && species !== "Unknown Bird") {
        speciesCount[species]++;
      } else {
        speciesCount[species] = 1;
      }
    }
  });

  let mostCommonSpecies: string | null = null;
  let maxCount = 0;

  for (const species in speciesCount) {
    if (speciesCount[species] > maxCount) {
      maxCount = speciesCount[species];
      mostCommonSpecies = species;
    }
  }

  const result = {
    total,
    mostCommonSpecies,
  };

  return result;
};

const processBreakdownData = async (
  data: ParsedData[],
  year: number,
  month: number
) => {
  const speciesCount: { [key: string]: number } = {};

  data.forEach((item: ParsedData) => {
    const { Date: date, Species: species } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    if (month == parseInt(currentMonth) && year == parseInt(currentYear)) {
      if (speciesCount[species]) {
        speciesCount[species]++;
      } else {
        if (species !== "Unknown Bird" && species.length > 0) {
          speciesCount[species] = 1;
        }
      }
    }
  });

  const entries = Object.entries(speciesCount);
  entries.sort(([, a], [, b]) => b - a);
  const top5 = entries.slice(0, 5);
  const otherSum = entries.slice(5).reduce((acc, [, value]) => acc + value, 0);
  const breakdown: SpeciesBreakdown = {
    ...Object.fromEntries(top5),
    other: otherSum,
  };

  const mostCommonSpecies = entries[0] ? entries[0][0] : "";

  const result = {
    breakdown,
    mostCommonSpecies,
  };

  return result;
};

const processMapData = async (
  data: ParsedData[],
  year: number,
  month: number
) => {
  const coordinates: Coordinate[] = [];

  data.forEach((item: ParsedData) => {
    const { Date: date, x, y } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    if (month == parseInt(currentMonth) && year == parseInt(currentYear)) {
      if (x && y) {
        coordinates.push({
          x: parseFloat(x),
          y: parseFloat(y),
        });
      }
    }
  });

  const result = {
    coordinates,
  };

  return result;
};
