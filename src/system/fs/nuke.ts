import * as fs from "fs";
import * as path from "path";

/**
 * Obliterates the file/directory at the specified path.
 *
 * @param   {string}  path
 *          The absolute path of the file/directory to destroy.
 * @return  {Promise<void>}
 *          A `Promise` which is resolved once the item has been destroyed.
 */
export function nuke(dir: string)
: Promise<void> {
  return new Promise((accept, reject) => {
    fs.stat(dir, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.isFile()) {
        fs.unlink(dir, (err2) => {
          if (err2) {
            reject(err2);
          } else {
            accept();
          }
        });
      } else if (stats.isDirectory()) {
        fs.readdir(dir, (err2, files) => {
          if (err2) return reject(err2);
          const cbs = files
              .map(x => path.join(dir, x))
              .map(x => nuke(x));
          Promise.all(cbs)
              .then(() => {
                fs.rmdir(dir, (err4) => {
                  if (err4) {
                    reject(err4);
                  } else {
                    accept();
                  }
                });
              })
              .catch((err3) => void reject(err3));
        });
      } else {
        accept();
      }
    });
  });
}

/**
 * @param   {string}  dir
 *          Path to a file or directory to destroy.
 * @return  {void}
 * @throws  {Error}
 */
export function nukeSync(dir: string)
: never | void {
  const stats = fs.statSync(dir);
  if (stats.isDirectory()) {
    const files = fs.readdirSync(dir);
    files
        .map(x => path.join(dir, x))
        .map(x => nukeSync(x));
    fs.rmdirSync(dir);
  } else if (stats.isFile()) {
    fs.unlinkSync(dir);
  }
}
