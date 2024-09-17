"use client";

import { useState } from "react";

import { ParsedData } from "@/types";
import UploadButton from "@/components/UploadButton";
import GraphicsPane from "@/components/GraphicsPane";

const FileUploader = () => {
  const [data, setData] = useState<ParsedData[]>([]);
  const [renderGraphics, setRenderGraphics] = useState<boolean>(false);

  return (
    <div className="flex flex-row justify-center w-full min-h-screen bg-red-50">
      <div className="flex flex-col items-center">
        {renderGraphics ? (
          <GraphicsPane data={data} />
        ) : (
          <UploadButton setData={setData} renderGraphics={setRenderGraphics} />
        )}
      </div>
    </div>
  );
};

export default FileUploader;
