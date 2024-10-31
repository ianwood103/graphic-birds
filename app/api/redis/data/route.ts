import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import redis from "@/utils/redis";
import { ParsedData } from "@/utils/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json(
        { error: "CSV data is required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const newEntry = {
      id,
      data,
      createdAt: Date.now(),
    };

    await redis.hset("data", id, JSON.stringify(newEntry));

    const result = {
      id,
    };

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
