'use client'

import { saveAs } from 'file-saver';

import { Parser } from './parser';
import { FilesDropZone } from './components/FilesDropZone';

export default function Home() {
  const inputId = 'md-files';

  const handleFiles = async () => {
    var fileInput = document.getElementById(inputId);
    var files = fileInput?.files;

    const parser = new Parser();

    if (!Parser.validateFiles(files)) {
      return alert('Selected files contain invalid type');
    }

    const r = await parser.parse(files);
    const blob = new Blob([r[0]]);

    // saveAs(blob, 'test.txt');
  }

  return (
    <main className="flex-auto flex flex-col items-center">
      <FilesDropZone inputId={inputId} />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleFiles}
      >Convert</button>
    </main>
  );
}
