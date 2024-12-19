import { birdFileMap } from "./constants";
import redis from "./redis";
import { gunzip } from "zlib";
import { promisify } from "util";

export const getBirdFilename = (bird: string) => {
  const decodedBirdname = bird
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/'/g, "")
    .replace(/-/g, "_");
  return birdFileMap[decodedBirdname] || "/bird_placeholder.png";
};

export const getData = async (id: string) => {
  const redisData = await redis.hget(id, "data");
  if (redisData) {
    const { data } = JSON.parse(redisData);
    const gunzipAsync = promisify(gunzip);
    const decompressedData = await gunzipAsync(Buffer.from(data));
    return JSON.parse(decompressedData.toString());
  } else {
    return [];
  }
};
