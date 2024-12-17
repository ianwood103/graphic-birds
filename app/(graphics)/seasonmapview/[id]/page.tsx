import type { NextPage } from "next";
import Image from "next/image";
import { Coordinate, ParsedData } from "@/utils/types";
import { getData } from "@/utils/helpers";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

interface Props {
  params: { id: string };
  searchParams: {
    year?: string;
    season?: string;
  };
}

const SeasonMapView: NextPage<Props> = async ({ params, searchParams }) => {
  const { id } = params;
  const season = searchParams.season || "fall";
  const year = parseInt(searchParams.year || "2024", 10);

  const data = await getData(id);
  const { coordinates } = await processData(data, year, season);

  return (
    <div
      className="w-[36rem] h-[36rem] bg-white overflow-hidden relative"
      id="seasonmapview"
    >
      {coordinates && <MapView coordinates={coordinates} />}
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
      <div className="flex flex-col w-5/12 items-start absolute top-[4rem] left-[20rem] z-20">
        <h1 className="font-bold text-3xl text-primary z-20">
          Where are volunteers finding dead birds?
        </h1>
        <span className=" text-xl text-primary z-20">
          Our volunteer citizen scientists walk standardized routes in three
          locations in Atlanta, highlighted here. Help us monitor bird-building
          collisions by joining our team of citizen scientists!
        </span>
      </div>
      <div className="absolute top-0 left-0 w-full bg-darkPrimary bg-opacity-95 z-20 text-center">
        <span className="font-montserrat text-[23px] font-[400] leading-[48px] text-white">
          {season.charAt(0).toUpperCase() + season.slice(1)} {year}
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

export default SeasonMapView;

const processData = async (
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
