import type { NextPage } from "next";
import { ParsedData } from "@/utils/types";
import { MONTHS } from "@/utils/constants";
import { getBirdFilename, getData } from "@/utils/helpers";
import { SpeciesBreakdown } from "@/utils/types";
import BarChart from "@/components/BarChart";
import Image from "next/image";

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    month?: string;
  };
}

const MonthlySpeciesBreakdownPage: NextPage<Props> = async ({
  params,
  searchParams,
}) => {
  const { id } = params;
  const month = parseInt(searchParams.month || "0", 10);
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { breakdown, mostCommonSpecies } = await processData(data, year, month);
  const filename = mostCommonSpecies
    ? getBirdFilename(mostCommonSpecies)
    : "/bird_placeholder.png";

  return (
    <div
      className="w-[36rem] h-[64rem] bg-white rounded-md box-shadow text-white flex flex-row justify-center relative"
      id="monthlyspeciesbreakdownv2"
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
      <div className="flex flex-row w-full h-full bg-[#0F3D5FE5] bg-opacity-80 z-20">
        <div className="flex flex-col items-center w-full h-full relative">
          {/* Date */}
          <span className="font-montserrat text-[23px] font-[400] leading-[48px]">
            {MONTHS[month].toUpperCase()} {year}
          </span>
          <span className="font-montserrat text-[34px] font-[700] leading-tight text-center w-10/12 mt-[110px]">
            What species were found by voluneers?
          </span>
          <div className="w-11/12 h-full mt-[110px]">
            <BarChart breakdown={breakdown} />
          </div>
          <span className="font-montserrat text-[24px] font-[400] mb-[240px] leading-tight text-center w-8/12">
            Migrating species are most vulnerable to bird-building collisions.
          </span>
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

export default MonthlySpeciesBreakdownPage;

const processData = async (data: ParsedData[], year: number, month: number) => {
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
