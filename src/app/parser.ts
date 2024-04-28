const ALLOWED_FILE_EXTENSIONS = ['md'];

const tagsMap = {
  h1: '#',
  h2: '##',
  h3: '###',
  h4: '####',
}

export class Parser {
  async parse(files: File[], configs: ParseConfigs) {
    const promises = [...files].map((file) => {
      return new Promise((res, rej) => {
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          res(this.parseTextFile(event.target!.result as string, configs))
        };
        
        fileReader.onerror = (event) => {
          rej(event.target!.error);
        };

        fileReader.readAsText(file);
      })
    });

    const results = configs.allOrNothing
      ? await Promise.all(promises)
      : await Promise.allSettled(promises);

    return this.normalizeResults(results, configs);
  }

  parseTextFile(file: string, configs: ParseConfigs) {
    let cardName = '';
    let cardDescription = ''

    const mdHeadingTag = tagsMap[configs.cardNameFieldTag];

    const lines = file.split('\n');

    lines.forEach(line => {
      if (line.startsWith(`${mdHeadingTag} `)) {
        cardName = line
        .slice(mdHeadingTag.length)
        .trim()
        // TODO: dumb approach; requires refactoring
        .replace(/^Issue/, '')
        .replace(/"/g, '""');
      } else {
        cardDescription += line.trim().replace(/"/g, '""') + '\n';
      }
    });

    return `"${cardName}","${cardDescription.trim()}","${configs.listNameField}"`;
  }

  normalizeResults(results: any, configs: ParseConfigs) {  
    const csvContent = 'Card Name,Card Description,List Name';

    const parsed = configs.allOrNothing
      ? results
      : results.filter((res: PromiseSettledResult<string>) => res.status === 'fulfilled').map(({ value }: { value: string }) => value);

    return parsed.reduce((csvRes: string, fileRow: string) => {
      return `${csvRes}\n${fileRow}\n`
    }, csvContent);
  }

  static validateFiles(files: File[]) {
    return [...files].every((file) => {
      return ALLOWED_FILE_EXTENSIONS.includes(file.name.split('.').at(-1)!);
    })
  }
}