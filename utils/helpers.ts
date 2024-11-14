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
