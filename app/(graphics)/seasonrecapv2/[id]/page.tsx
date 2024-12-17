import type { NextPage } from "next";
import { ParsedData } from "@/utils/types";
import { getBirdFilename, getData } from "@/utils/helpers";
import Image from "next/image";

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    season?: string;
  };
}

const SeasonRecapPage: NextPage<Props> = async ({ params, searchParams }) => {
  const { id } = params;
  const season = searchParams.season || "fall";
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { mostCommonSpecies } = await processData(data, year, season);
  const filename = mostCommonSpecies
    ? getBirdFilename(mostCommonSpecies)
    : "/bird_placeholder.png";

  return (
    <div
      className="w-[36rem] h-[64rem] bg-white rounded-md box-shadow text-white flex flex-row justify-center relative"
      id="seasonrecapv2"
    >
      <div className="absolute w-[36rem] h-[64rem] z-10">
        <Image
          src={filename}
          alt="Bird Placeholder"
          width={1000}
          height={1000}
          className="w-[36rem] h-[64rem] object-cover"
        />
      </div>
      <div className="flex flex-row w-10/12 h-full bg-darkPrimary bg-opacity-65 z-20">
        <div className="flex flex-col items-center w-full h-full relative">
          <span className="font-montserrat text-[23px] font-[400] leading-[48px]">
            {season.toUpperCase()} {year}
          </span>
          <span className="font-montserrat text-[65px] font-[700] w-9/12 leading-[75px] text-center mt-[280px]">
            SEASON RECAP
          </span>
          <span className="font-montserrat text-[30px] font-[700] leading-tight text-center w-9/12 mt-[20px]">
            PROJECT SAFE FLIGHT
          </span>
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

export default SeasonRecapPage;

const processData = async (
  data: ParsedData[],
  year: number,
  season: string
) => {
  if (!data) {
    return { mostCommonSpecies: "Unknown" };
  }

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
    mostCommonSpecies,
  };

  return result;
};
