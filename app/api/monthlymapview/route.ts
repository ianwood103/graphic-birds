import { NextRequest, NextResponse } from "next/server";

import { ParsedData, Coordinate } from "@/utils/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { data, month, year } = body;

    if (!data) {
      return NextResponse.json(
        { error: "CSV data is required" },
        { status: 400 }
      );
    }

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

    console.log(result);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
