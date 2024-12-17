import type { NextPage } from "next";
import { ParsedData } from "@/utils/types";
import { getData } from "@/utils/helpers";
import { SpeciesBreakdown } from "@/utils/types";
import SeasonBarChart from "@/components/SeasonBarChart";
import Image from "next/image";

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    season?: string;
  };
}

const SeasonSpeciesBreakdownPage: NextPage<Props> = async ({
  params,
  searchParams,
}) => {
  const { id } = params;
  const season = searchParams.season || "fall";
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { breakdown } = await processData(data, year, season);

  return (
    <div
      className="w-[36rem] h-[64rem] text-white flex flex-row justify-center relative"
      id="seasonspeciesbreakdownv2"
    >
      <div className="flex flex-row w-full h-full bg-darkPrimary">
        <div className="flex flex-col items-center w-full h-full relative">
          {/* Date */}
          <span className="font-montserrat text-[23px] font-[400] leading-[48px]">
            {season.toUpperCase()} {year}
          </span>
          <span className="font-montserrat text-[35px] font-[700] leading-tight text-center w-10/12 mt-[15px]">
            What species were found by voluneers?
          </span>
          <div
            className="w-11/12 h-[770px] mt-[10px] relative"
            style={{ top: "-60px", left: "30px" }}
          >
            <SeasonBarChart breakdown={breakdown} portrait />
          </div>
          <div className="flex flex-row absolute bottom-2 left-1/2 -ml-[45px] mb-[15px] gap-2">
            <Image
              src="/birds_ga.png"
              alt="Birds GA Logo"
              width={40}
              height={28}
            />
            <Image src="/gt_logo.png" alt="GT Logo" width={55} height={28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonSpeciesBreakdownPage;

const processData = async (
  data: ParsedData[],
  year: number,
  season: string
) => {
  const speciesCount: { [key: string]: number } = {};

  data.forEach((item: ParsedData) => {
    const { Date: date, Species: species } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    const monthNum = parseInt(currentMonth);
    const isInSeason =
      season === "fall"
        ? monthNum >= 8 && monthNum <= 11
        : monthNum >= 3 && monthNum <= 6;

    if (isInSeason && year == parseInt(currentYear)) {
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
  const top10 = entries.slice(0, 10);
  const otherSum = entries.slice(10).reduce((acc, [, value]) => acc + value, 0);
  const breakdown: SpeciesBreakdown = {
    ...Object.fromEntries(top10),
    other: otherSum,
  };

  const mostCommonSpecies = entries[0] ? entries[0][0] : "";

  const result = {
    breakdown,
    mostCommonSpecies,
  };

  return result;
};
