import { NextRequest, NextResponse } from "next/server";

import { ParsedData } from "@/utils/types";

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
    const otherSum = entries
      .slice(5)
      .reduce((acc, [, value]) => acc + value, 0);
    const breakdown = Object.fromEntries(top5);
    breakdown.other = otherSum;

    const result = {
      breakdown,
    };

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
