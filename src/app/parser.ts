interface ParseConfigs {
  allOrNothing?: boolean;
}

const ALLOWED_FILE_EXTENSIONS = ['md'];

export class Parser {
  async parse(files: FileList, configs: ParseConfigs = {}) {
    const promises = [...files].map((file) => {
      return new Promise((res, rej) => {
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          res(this.parseTextFile(event.target!.result as string))
        };
        
        fileReader.onerror = (event) => {
          rej(event.target!.error);
        };

        fileReader.readAsText(file)
      })
    });

    const results = configs.allOrNothing
      ? await Promise.all(promises)
      : await Promise.allSettled(promises);

    return this.normalizeResults(results, configs);
  }

  parseTextFile(file: string) {
    console.log(file);
    return file;
  }

  normalizeResults(results: any, configs: ParseConfigs) {  
    return configs.allOrNothing
      ? results
      : results.filter((res: PromiseSettledResult<string>) => res.status === 'fulfilled').map(({ value }: { value: string }) => value)
  }

  static validateFiles(files: FileList) {
    return [...files].every((file) => {
      return ALLOWED_FILE_EXTENSIONS.includes(file.name.split('.').at(-1)!);
    })
  }
}