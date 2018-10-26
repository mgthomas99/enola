import * as fs from "fs";

/**
 * Obliterates the file/directory at the specified path.
 *
 * @param   {string}  path
 *          The absolute path of the file/directory to destroy.
 * @return  {Promise<void>}
 *          A `Promise` which is resolved once the item has been destroyed.
 */
export function nuke(path: string)
: Promise<void> {
  return new Promise((accept, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) return reject(err);
      if (stats.isFile()) {
        //
      } else if (stats.isDirectory()) {
        fs.readdir(path, (err2, files) => {
          if (err2) return reject(err2);
          const cbs = files.map(x => nuke(x));
          Promise.all(cbs)
              .then(() => void accept())
              .catch((err3) => void reject(err3));
        });
      } else {
        accept();
      }
    });
  });
}
