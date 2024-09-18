import { NextRequest, NextResponse } from "next/server";

import { ParsedData } from "@/types";

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

    let total = 0;
    data.forEach((item: ParsedData) => {
      const currentDate = item.Date.split(" ")[0];
      const [currentMonth, _, currentYear] = currentDate.split("/");

      if (month == parseInt(currentMonth) && year == parseInt(currentYear)) {
        total += 1;
      }
    });

    const result = {
      total,
    };

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
