import { NextResponse, NextRequest } from "next/server";
import { getData } from "@/utils/helpers";
import { ParsedData } from "@/utils/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const season = searchParams.get("season");
  const year = searchParams.get("year");

  if (!season || !year) {
    return NextResponse.json(
      { error: "Season and year are required" },
      { status: 400 }
    );
  }

  const count = await getSeasonBirdCount(params.id, season, year);

  return NextResponse.json({ count });
}

async function getSeasonBirdCount(id: string, season: string, year: string) {
  const data = await getData(id);
  if (!data) {
    return { total: 0, mostCommonSpecies: "Unknown" };
  }
  let count = 0;
  data.forEach((item: ParsedData) => {
    const { Date: date } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    const monthNum = parseInt(currentMonth);
    const isInSeason =
      season === "fall"
        ? monthNum >= 8 && monthNum <= 11
        : monthNum >= 3 && monthNum <= 6;

    if (isInSeason && year === currentYear) {
      count += 1;
    }
  });

  return count;
}
