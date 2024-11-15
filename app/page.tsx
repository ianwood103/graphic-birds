import UploadButton from "@/components/UploadButton";

const FileUploader = () => {
  return (
    <div className="flex flex-row justify-center w-full min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <UploadButton />
      </div>
    </div>
  );
};

export default FileUploader;
