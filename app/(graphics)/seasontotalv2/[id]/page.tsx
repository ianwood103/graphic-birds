import type { NextPage } from "next";
import { ParsedData } from "@/utils/types";
import { SEASONS } from "@/utils/constants";
import { getData } from "@/utils/helpers";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    season?: string;
  };
}

const SeasonTotalPage: NextPage<Props> = async ({ params, searchParams }) => {
  const { id } = params;
  const season = searchParams.season || "fall";

  if (!SEASONS.includes(season)) {
    notFound();
  }

  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { total, mostCommonSpecies } = await processData(data, year, season);

  return (
    <div
      className="w-[36rem] h-[64rem] bg-darkPrimary text-white flex flex-row justify-center relative"
      id="seasontotalv2"
    >
      <div className="flex flex-row w-10/12 h-full bg-darkPrimary bg-opacity-65 z-20">
        <div className="flex flex-col items-center w-full h-full relative">
          {/* Date */}
          <span className="font-montserrat text-[23px] font-[400] leading-[48px]">
            {season.toUpperCase()} {year}
          </span>
          {/* Total collisions */}
          <span className="font-montserrat text-[123px] font-[700] mt-[255px]">
            {total}
          </span>
          <span className="font-montserrat text-[37px] font-[700] leading-tight text-center w-10/12 -mt-[10px]">
            Collisions recorded by volunteers
          </span>
          {/* Most common species */}
          {mostCommonSpecies && (
            <span className="font-montserrat text-[20px] font-[400] mt-[60px] leading-tight text-center w-7/12">
              The most common bird found this season was the {mostCommonSpecies}
              .
            </span>
          )}
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

export default SeasonTotalPage;

const processData = async (
  data: ParsedData[],
  year: number,
  season: string
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

    const monthNum = parseInt(currentMonth);
    const isInSeason =
      season === "fall"
        ? monthNum >= 8 && monthNum <= 11
        : monthNum >= 3 && monthNum <= 6;

    if (isInSeason && year === parseInt(currentYear)) {
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
