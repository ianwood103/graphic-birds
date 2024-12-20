import { NextPage } from "next";
import Image from "next/image";

const Instructions: NextPage = () => {
  return (
    <div className="w-full flex flex-col text-darkPrimary">
      <h1 className="text-center text-3xl font-bold mt-10">
        Instructions for Downloading CSV Bird Data
      </h1>
      <span className="text-md text-center">
        Starting from ArcGIS home page for Birds Georgia
      </span>
      <div className="w-full flex flex-col justify-center gap-10 mt-10 p-10">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex flex-col">
            <h1 className="font-bold text-2xl">Step {index + 1}:</h1>
            <Image
              src={`/instructions/${index + 1}.jpg`}
              height={800}
              width={800}
              alt={`Instructions for downloading CSV file step ${index + 1}.`}
              className="h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;
