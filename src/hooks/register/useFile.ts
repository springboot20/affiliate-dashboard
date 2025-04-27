import { useState } from "react";

const fileExtensions: string[][] = [
  [".png", ".jpeg"],
  [".jpg", ".svg"],
];

export const useFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDropping, setIsDropping] = useState<boolean>(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropping(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleDragLeave = () => {
    setIsDropping(false);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDropping(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const isFileExtValid = (file: string) => {
    return fileExtensions.some((ext) => ext.includes(file));
  };

  return {
    handleDrop,
    handleDragLeave,
    handleDragEnter,
    setSelectedFile,
    handleFileChange,
    isFileExtValid,
    selectedFile,
    isDropping,
  };
};
