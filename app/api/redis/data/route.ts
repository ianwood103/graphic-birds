import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { gzip } from "zlib";
import { promisify } from "util";

import redis from "@/utils/redis";

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
    const gzipAsync = promisify(gzip);
    const compressedData = await gzipAsync(JSON.stringify(data));

    const newEntry = {
      id,
      data: compressedData,
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
    console.log(error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
