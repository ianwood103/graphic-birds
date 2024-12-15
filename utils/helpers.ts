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
    return "invalid id";
  }
};

export const downloadGraphic = async (
  graphic: string,
  id: string,
  year: number,
  month: number
) => {
  const isProduction = process.env.NODE_ENV === "production";
  const searchParams = new URLSearchParams({
    year: year.toString(),
    month: month.toString(),
  });
  const url = `${
    isProduction ? "https://visual-birds.vercel.app" : "http://localhost:3000"
  }/${graphic}/${id}?${searchParams.toString()}`;
  const selector = `#${graphic}`;

  const response = await fetch("/api/screenshot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, selector }),
  });

  const { downloadUrl } = await response.json();
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = `${graphic}.jpg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
