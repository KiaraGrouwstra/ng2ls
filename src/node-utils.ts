import * as R from 'ramda';
declare let require;
const fs = require('fs');

// write to a file, creating the containing folder if needed
export function writeFile(fpath: string, str: string) {
  const getPath = R.pipe(R.split('/'), R.init, R.join('/'));
  let path = getPath(fpath);
  fs.mkdir(path, (e) => {
    fs.open(fpath, 'w', () => {
      fs.writeFile(fpath, str, (e) => {
        if (e) throw e;
        console.log(`wrote to ${fpath}`);
      });
    });
  });
}

export let prettyStringify: (v: any) => string = R.pipe(
  (v: any) => JSON.stringify(v, null, ' '),
  R.replace(/"(\w+)":/g, '$1:'),
  R.replace(/"/g, "'"),
  R.replace(/\s+/g, ' ')
);
