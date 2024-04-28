'use client'

import { useCallback, useRef, useState } from "react";
import { saveAs } from 'file-saver';

import { Parser } from '../../parser';

interface FilesDropZoneProps {
  inputId: string;
  inputName: string;
}

export const FilesDropZone = ({ inputId, inputName }: FilesDropZoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [highlight, setHighlight] = useState(false);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    setHighlight(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setHighlight(false);
  }, []);

  const onDrop = useCallback((event: any) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;

    inputRef.current!.files = files;
    setSelectedFiles(files);
    setHighlight(false);
  }, []);

  const onSelectFiels = useCallback((e: any) => {
    setSelectedFiles(e.target?.files);
  }, []);

  return (
    <div
      className={`p-8 flex-auto flex justify-center flex-col gap-5 items-center border-2 rounded-2xl border-dashed
        ${highlight ? 'border-green-500 bg-green-100' : 'border-blue-900 bg-blue-200'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <label
        className="w-64 flex flex-col items-center px-4 py-6 text-black rounded-lg shadow-lg tracking-wide uppercase border border-blue-400 cursor-pointer hover:bg-blue"
        htmlFor={inputId}
      >
        Upload files
      </label>
      <input
        ref={inputRef}
        id={inputId}
        name={inputName}
        onChange={onSelectFiels}
        className="hidden"
        type="file"
        accept=".md"
        multiple
      />

      <span className="font-medium text-gray-700"><b>OR</b></span>
      <span className="font-medium text-gray-700">Drop files here</span>

      {Boolean(selectedFiles?.length) && (
        <span className="font-medium text-gray-500">Selected files: {selectedFiles!.length}</span>
      )}
    </div>
  );
}
