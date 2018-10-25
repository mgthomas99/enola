import * as rimraf from "rimraf";

/**
 * Obliterates the file/directory at the specified path.
 *
 * @param   {string}  path
 *          The absolute path of the file/directory to destroy.
 * @return  {Promise<void>}
 *          A `Promise` which is resolved once the item has been destroyed.
 */
export function nuke(path: string):
Promise<void> {
  return new Promise((accept, reject) => {
    rimraf(path, (err) => {
      return err
          ? reject(err)
          : accept();
    });
  });
}
