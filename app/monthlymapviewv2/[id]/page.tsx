import type { NextPage } from "next";
import Image from "next/image";
import { Coordinate, ParsedData } from "@/utils/types";
import { MONTHS } from "@/utils/constants";
import { getData } from "@/utils/helpers";
import dynamic from "next/dynamic";

const MapViewV2 = dynamic(() => import("@/components/MapViewV2"), {
  ssr: false,
});

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    month?: string;
  };
}

const MonthlyMapView: NextPage<Props> = async ({ params, searchParams }) => {
  const { id } = params;
  const month = parseInt(searchParams.month || "0", 10);
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { coordinates } = await processData(data, year, month);

  return (
    <div
      className="w-[36rem] h-[64rem] bg-white overflow-hidden relative"
      id="monthlymapviewv2"
    >
      {coordinates && <MapViewV2 coordinates={coordinates} />}
      <div className="w-36 h-24 flex flex-col items-center absolute top-[11.4rem] left-[18rem] z-20">
        <div className="outline-dotted w-10/12 h-full outline-black outline-2 z-20"></div>
        <span className="text-primary text-sm">Buckhead Route</span>
      </div>
      <div className="w-52 h-28 flex flex-col items-center absolute top-[42.3rem] left-[4.7rem] z-20">
        <div className="outline-dotted w-6/12 h-full outline-black outline-2 z-20"></div>
        <span className="text-primary text-sm">Georgia Tech Route</span>
      </div>
      <div className="w-48 h-32 flex flex-col items-center absolute top-[50.8rem] left-[9rem] z-20">
        <div className="outline-dotted w-8/12 h-full outline-black outline-2 z-20"></div>
        <span className="text-primary text-sm">Downtown Route</span>
      </div>
      <div className="absolute flex flex-col items-center top-0 left-0 w-full bg-darkPrimary bg-opacity-95 z-20 text-center">
        <span className="font-montserrat text-[23px] font-[400] leading-[48px] text-white">
          {MONTHS[month].toUpperCase()} {year}
        </span>
        <span className="font-montserrat text-[34px] font-[700] leading-tight text-center w-9/12 -mt-[10px] py-3">
          Where are volunteers finding dead birds?
        </span>
      </div>
      <div className="flex flex-row justify-center w-full bg-darkPrimary bg-opacity-95 absolute bottom-0 left-0 z-20 gap-2 py-4">
        <Image src="/birds_ga.png" alt="Birds GA Logo" width={30} height={28} />
        <Image src="/gt_logo.png" alt="GT Logo" width={40} height={28} />
      </div>
      <div className="flex flex-row absolute bottom-0 left-1/2 -ml-[35px] mb-[15px] gap-2 z-20"></div>
    </div>
  );
};

export default MonthlyMapView;

const processData = async (data: ParsedData[], year: number, month: number) => {
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
