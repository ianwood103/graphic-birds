import type { NextPage } from "next";
import redis from "@/utils/redis";
import { ParsedData } from "@/utils/types";
import { MONTHS } from "@/utils/constants";
import { getBirdFilename } from "@/utils/helpers";
import Image from "next/image";

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    month?: string;
  };
}

const MonthlyBirdTotalPage: NextPage<Props> = async ({
  params,
  searchParams,
}) => {
  const { id } = params;
  const month = parseInt(searchParams.month || "0", 10);
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { total, mostCommonSpecies } = await processData(data, year, month);
  const filename = mostCommonSpecies
    ? getBirdFilename(mostCommonSpecies)
    : "/bird_placeholder.png";

  return (
    <div
      className="w-[36rem] h-[64rem] bg-white rounded-md box-shadow text-white flex flex-row justify-center relative"
      id="monthlybirdtotalv2"
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
          {/* Date */}
          <span className="font-montserrat text-[23px] font-[400] leading-[48px]">
            {MONTHS[month].toUpperCase()} {year}
          </span>
          {/* Total collisions */}
          <span className="font-montserrat text-[130px] font-[700] mt-[190px]">
            {total}
          </span>
          <span className="font-montserrat text-[34px] font-[700] leading-tight text-center w-9/12 -mt-[10px]">
            Collisions recorded by volunteers
          </span>
          {/* Most common species */}
          {mostCommonSpecies && (
            <span className="font-montserrat text-[24px] font-[400] mt-[160px] leading-tight text-center w-8/12">
              The most common bird found this month was the {mostCommonSpecies}.
            </span>
          )}
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
    </div>
  );
};

export default MonthlyBirdTotalPage;

const getData = async (id: string) => {
  const redisData = await redis.hget("data", id);
  if (redisData) {
    const { data } = JSON.parse(redisData);
    return data;
  } else {
    return "invalid id";
  }
};

const processData = async (data: ParsedData[], year: number, month: number) => {
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
