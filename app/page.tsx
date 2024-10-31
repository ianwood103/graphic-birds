"use client";

import { useState } from "react";

import { ParsedData } from "@/utils/types";
import UploadButton from "@/components/UploadButton";
import GraphicsPane from "@/components/GraphicsPane";

const FileUploader = () => {
  return (
    <div className="flex flex-row justify-center w-full min-h-screen bg-gray-200">
      <div className="flex flex-col items-center">
        <UploadButton />
      </div>
    </div>
  );
};

export default FileUploader;
