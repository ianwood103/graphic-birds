import type { NextPage } from "next";
import { Coordinate, ParsedData, SpeciesBreakdown } from "@/utils/types";
import { getBirdFilename, getData } from "@/utils/helpers";
import Image from "next/image";
import dynamic from "next/dynamic";
import SeasonBarChartBanner from "@/components/SeasonBarChartBanner";

const MapViewBanner = dynamic(() => import("@/components/MapViewBanner"), {
  ssr: false,
});

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    season?: string;
  };
}

const SeasonBannerPage: NextPage<Props> = async ({ params, searchParams }) => {
  const { id } = params;
  const season = searchParams.season || "fall";
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { mostCommonSpecies, total } = await processTotalData(
    data,
    year,
    season
  );
  const { breakdown } = await processBreakdownData(data, year, season);
  const { coordinates } = await processMapData(data, year, season);
  const { atlanta, savannah, brunswick } = await processGeorgiaData(
    data,
    year,
    season
  );

  const filename = mostCommonSpecies
    ? getBirdFilename(mostCommonSpecies)
    : "/bird_placeholder.png";

  return (
    <div
      className="w-[64rem] h-[36rem] flex flex-row bg-darkPrimary box-shadow text-white justify-center relative overflow-hidden"
      id="seasonbanner"
    >
      <div className="w-1/3 h-[36rem] relative">
        <h1 className="absolute top-7 m-auto w-full text-center font-bold text-5xl">
          {season.toUpperCase()} {year}
        </h1>
        <Image
          src={filename}
          alt="Bird Placeholder"
          width={1000}
          height={1000}
          className="w-full h-[36rem] object-cover"
        />
      </div>
      <div className="w-2/3 flex flex-col">
        <h1 className="w-full text-center mt-9 font-bold text-3xl italic">
          Project Safe Flight Season Recap
        </h1>
        <div className="w-full h-full flex flex-row">
          <div className="flex flex-col w-1/2 h-full p-10">
            <div className="flex flex-row w-full items-center justify-between gap-4">
              <span className="font-bold text-7xl w-1/2">{total}</span>
              <span className="font-bold text-lg leading-tight w-1/2 text-center">
                Collisions recorded by volunteers
              </span>
            </div>
            <div className="h-full -mt-5">
              <SeasonBarChartBanner breakdown={breakdown} />
            </div>
          </div>
          <div className="w-1/2 h-full relative">
            <div className="h-[85%] w-3/4 pt-10 overflow-hidden relative">
              <MapViewBanner coordinates={coordinates} />
              <div className="w-32 h-20 flex flex-col items-center absolute top-[2.8rem] left-[8rem] z-20">
                <div className="outline-dotted w-10/12 h-full outline-black outline-2 z-20"></div>
                <span className="text-primary text-sm">Buckhead Route</span>
              </div>
              <div className="w-36 h-20 flex flex-col items-center absolute top-[16.3rem] left-[2.5rem] z-20">
                <span className="text-primary text-sm mb-1">
                  Georgia Tech Route
                </span>
                <div className="outline-dotted w-6/12 h-full outline-black outline-2 z-20"></div>
              </div>
              <div className="w-32 h-20 flex flex-col items-center absolute top-[21.8rem] left-[6rem] z-20">
                <div className="outline-dotted w-8/12 h-full outline-black outline-2 z-20"></div>
                <span className="text-primary text-sm">Downtown Route</span>
              </div>
            </div>
            <div className="absolute top-[10rem] left-[10rem] bg-primary rounded-lg text-3xl text-white px-4 z-20">
              Atlanta
            </div>
            <div className="absolute bottom-10 -left-20 z-20">
              <Image
                className=""
                src="/georgia.png"
                alt="Georgia"
                width={200}
                height={200}
              />
              {atlanta > 0 && (
                <div className="absolute top-[2rem] left-[3rem] flex flex-col justify-center items-center text-black border-primary border-[3px] bg-white rounded-full w-16 h-16 text-xl">
                  {atlanta}
                </div>
              )}
              {savannah > 0 && (
                <div className="absolute top-[7rem] left-[10rem] flex flex-col justify-center items-center text-black border-primary border-[3px] bg-white rounded-full w-8 h-8">
                  {savannah}
                </div>
              )}
              {brunswick > 0 && (
                <div className="absolute top-[10rem] left-[8.8rem] flex flex-col justify-center items-center text-black border-primary border-[3px] bg-white rounded-full w-8 h-8">
                  {brunswick}
                </div>
              )}
              <div className="absolute top-[8rem] left-0 bg-primary rounded-lg text-xl text-white px-4">
                Georgia
              </div>
            </div>
          </div>
          <div className="flex flex-row absolute bottom-4 right-4 gap-2">
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
    </div>
  );
};

export default SeasonBannerPage;

const processTotalData = async (
  data: ParsedData[],
  year: number,
  season: string
) => {
  if (!data) {
    return { mostCommonSpecies: "Unknown", total: 0 };
  }

  const speciesCount: { [key: string]: number } = {};

  let total = 0;
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
      total += 1;
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
    total,
  };

  return result;
};

const processBreakdownData = async (
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

const processMapData = async (
  data: ParsedData[],
  year: number,
  season: string
) => {
  const coordinates: Coordinate[] = [];

  data.forEach((item: ParsedData) => {
    const { Date: date, x, y } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    const monthNum = parseInt(currentMonth);
    const isInSeason =
      season === "fall"
        ? monthNum >= 8 && monthNum <= 11
        : monthNum >= 3 && monthNum <= 6;

    if (isInSeason && year == parseInt(currentYear)) {
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

const processGeorgiaData = async (
  data: ParsedData[],
  year: number,
  season: string
) => {
  const result = { atlanta: 0, savannah: 0, brunswick: 0 };

  data.forEach((item: ParsedData) => {
    const { Date: date, y } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    const monthNum = parseInt(currentMonth);
    const isInSeason =
      season === "fall"
        ? monthNum >= 8 && monthNum <= 11
        : monthNum >= 3 && monthNum <= 6;

    const lat = parseFloat(y);

    if (isInSeason && year == parseInt(currentYear)) {
      if (lat >= 30.5 && lat <= 31.5) {
        result.brunswick += 1;
      } else if (lat >= 31.5 && lat <= 32.5) {
        result.savannah += 1;
      } else if (lat >= 33.5 && lat <= 34.5) {
        result.atlanta += 1;
      }
    }
  });

  return result;
};
