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
    const speciesCount: { [key: string]: number } = {};

    data.forEach((item: ParsedData) => {
      const { Date: date, Species: species } = item;
      const currentDate = date.split(" ")[0];
      const [currentMonth, _, currentYear] = currentDate.split("/");

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

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
