import UploadButton from "@/components/UploadButton";
import Link from "next/link";

const FileUploader = () => {
  return (
    <div className="relative flex flex-row justify-center w-full h-screen -mt-[6.5rem] bg-white">
      <div className="flex flex-col items-center">
        <UploadButton />
        <Link
          href={"/instructions"}
          className="absolute bottom-0 mb-4 text-sm text-primary hover:text-darkPrimary"
        >
          Need help finding the correct bird data CSV file to upload?
        </Link>
      </div>
    </div>
  );
};

export default FileUploader;
