"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import { ParsedData } from "@/utils/types";

import Papa from "papaparse";
import { MdFileUpload } from "react-icons/md";

const UploadButton: React.FC = () => {
  const csvRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const uploadData = async (data: ParsedData[]) => {
    const response = await fetch("/api/redis/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const { id } = await response.json();
    router.push("/dashboard/" + id);
  };

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
          uploadData(parsedData);
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
        className="w-fit rounded-lg p-8 text-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-darkPrimary"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-4">
          <MdFileUpload className="text-4xl" />
          <span className="text-sm">UPLOAD CSV</span>
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
