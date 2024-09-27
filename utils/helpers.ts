import domtoimage from "dom-to-image";

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
        link.download = "element.png";
        link.click();
      })
      .catch((error) => {
        console.error("Could not generate image", error);
      });
  }
};
