import type { NextPage } from "next";
import { ParsedData } from "@/utils/types";
import { getData } from "@/utils/helpers";
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
  const { atlanta, savannah, brunswick } = await processData(
    data,
    year,
    season
  );

  return (
    <div
      className="w-[36rem] h-[64rem] text-white flex flex-row justify-center relative"
      id="seasongeorgiav2"
    >
      <div className="flex flex-row w-full h-full bg-darkPrimary">
        <div className="flex flex-col items-center w-full h-full relative">
          {/* Date */}
          <span className="font-montserrat text-[23px] font-[400] leading-[48px]">
            {season.toUpperCase()} {year}
          </span>
          <span className="font-montserrat text-[35px] font-[700] leading-tight text-center w-10/12 mt-[15px]">
            Where are volunteers finding dead birds?
          </span>
          <Image
            className="mt-40"
            src="/georgia.png"
            alt="Georgia"
            width={450}
            height={450}
          />
          {atlanta > 0 && (
            <div className="absolute top-[380px] left-[165px] flex flex-col justify-center items-center text-black border-primary border-[3px] bg-white rounded-full w-32 h-32 text-xl">
              {atlanta}
            </div>
          )}
          {savannah > 0 && (
            <div className="absolute top-[550px] left-[420px] flex flex-col justify-center items-center text-black border-primary border-[3px] bg-white rounded-full w-20 h-20">
              {savannah}
            </div>
          )}
          {brunswick > 0 && (
            <div className="absolute top-[660px] left-[385px] flex flex-col justify-center items-center text-black border-primary border-[3px] bg-white rounded-full w-20 h-20">
              {brunswick}
            </div>
          )}
          <div className="absolute top-[605px] left-[60px] bg-primary rounded-lg text-4xl text-white px-4 py-1">
            Georgia
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
