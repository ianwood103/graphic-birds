import { NextResponse, NextRequest } from "next/server";
import { getData } from "@/utils/helpers";
import { ParsedData } from "@/utils/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (!month || !year) {
    return NextResponse.json(
      { error: "Month and year are required" },
      { status: 400 }
    );
  }

  const count = await getBirdCount(params.id, month, year);

  return NextResponse.json({ count });
}

async function getBirdCount(id: string, month: string, year: string) {
  const data = await getData(id);
  if (!data) {
    return { total: 0 };
  }

  let count = 0;
  data.forEach((item: ParsedData) => {
    const { Date: date, Species: species } = item;
    const currentDate = date.split(" ")[0];
    const [currentMonth, , currentYear] = currentDate.split("/");

    if (month == currentMonth && year == currentYear) {
      count += 1;
    }
  });

  return count;
}
