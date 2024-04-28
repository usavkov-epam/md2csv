'use client'

import { saveAs } from 'file-saver';
import { FormEventHandler } from 'react';

import { FilesDropZone } from './components';
import { Parser } from './parser';



export default function Home() {
  const inputId = 'md-files';

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const files = formData.getAll('md-files') as File[];
    const cardNameFieldTag = formData.get('card-name') as HeadingTag;
    const listNameField = formData.get('list-name') as string;

    const parser = new Parser();

    if (!files) {
      return alert('Please select at least 1 file with ".md" extension');
    }

    if (!Parser.validateFiles(files)) {
      return alert('Selected files contain invalid type');
    }

    const r = await parser.parse(files, { cardNameFieldTag, listNameField });
    const blob = new Blob([r]);

    saveAs(blob, `converted.csv`);
  }

  return (
    <main className="flex-auto flex flex-col items-center">
      <h1 className="text-5xl m-8">Markdown to CSV (RS School) <sup className="italic text-green-300">Beta</sup></h1>
      <h2>Generate a CSV file for uploading tasks to Trello based on the contents of Markdown files.</h2>

      <form
        id="convert-form"
        method="post"
        onSubmit={handleSubmit}
        className="w-4/5 m-8 flex justify-center flex-col gap-5 items-center"
      >
        <FilesDropZone
          inputId={inputId}
          inputName={inputId}
        />

        <fieldset
          className="m-5 p-10 flex gap-10 border-2 p-4 rounded-lg"
          name="mappings"
        >
          <legend className="px-5">Mappings:</legend>

          <label className="flex gap-5">
            List name:
            <input
              name="list-name"
              id="list-name-field"
              className="text-black px-2"
              placeholder="Backlog"
              defaultValue="Backlog"
              required
            />
          </label>

          <label className="flex gap-5">
            Card name source:
            <select
              name="card-name"
              id="card-name-field"
              className="text-black px-2"
              defaultValue="h3"
              required
              // TODO: implement fields mapping
              // disabled
            >
              {/* <option value="h1">h1 (#)</option>
              <option value="h2">h2 (##)</option> */}
              <option value="h3">h3 (###)</option>
              {/* <option value="h4">h4 (####)</option>
              <option value="h5">h5 (#####)</option>
              <option value="h6">h6 (######)</option> */}
            </select>
          </label>
        </fieldset>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >Convert</button>
      </form>
    </main>
  );
}
