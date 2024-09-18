"use client";

import { useRef } from "react";

import { ParsedData } from "@/types";

import Papa from "papaparse";
import { IoCloudUploadOutline } from "react-icons/io5";

interface UploadButtonProps {
  setData: React.Dispatch<React.SetStateAction<ParsedData[]>>;
  renderGraphics: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  setData,
  renderGraphics,
}) => {
  const csvRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    csvRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      Papa.parse<ParsedData>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data;
          setData(parsedData);
          renderGraphics(true);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else {
      alert("Please select a valid CSV file.");
    }
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <button
        className="w-fit rounded-lg p-8 text-lg bg-blue-500 bg-opacity-20 transition-all drop-shadow hover:bg-opacity-30"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-4">
          <IoCloudUploadOutline className="text-4xl text-blue-500" />
          <span className="font-thin text-blue-500 text-xs">UPLOAD CSV</span>
        </div>
      </button>
      <input
        type="file"
        accept=".csv"
        ref={csvRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadButton;
