import domtoimage from "dom-to-image";
import { birdFileMap } from "./constants";
import redis from "./redis";

export const downloadImage = (
  elementRef: React.RefObject<HTMLDivElement | null>
) => {
  if (elementRef.current) {
    const scale = 3;
    const node = elementRef.current;

    domtoimage
      .toPng(node, {
        quality: 1.0,
        width: node.clientWidth * scale,
        height: node.clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${node.clientWidth}px`,
          height: `${node.clientHeight}px`,
        },
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "graphic.png";
        link.click();
      })
      .catch((error) => {
        console.error("Could not generate image", error);
      });
  }
};

export const getBirdFilename = (bird: string) => {
  const decodedBirdname = bird
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/'/g, "")
    .replace(/-/g, "_");
  return birdFileMap[decodedBirdname] || "/bird_placeholder.png";
};

export const getData = async (id: string) => {
  const redisData = await redis.hget("data", id);
  if (redisData) {
    const { data } = JSON.parse(redisData);
    return data;
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
