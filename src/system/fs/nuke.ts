import * as fs from "fs-extra";
import * as path from "path";

/**
 * Obliterates the file/directory at the specified path.
 *
 * @param   {string}  path
 *          The absolute path of the file/directory to destroy.
 * @return  {Promise<void>}
 *          A `Promise` which is resolved once the item has been destroyed.
 */
export async function nuke(dir: string, exists = false)
: (Promise<void>) {
  if (typeof exists !== "boolean") exists = fs.existsSync(dir);
  if (! exists) return;

  const stats = await fs.stat(dir);

  if (stats.isDirectory()) {
    const files = await fs.readdir(dir);
    const callbacks = files
        .map(x => path.join(dir, x))
        .map(x => nuke(x));
    await Promise.all(callbacks);
    await fs.rmdir(dir);
  } else if (stats.isFile()) {
    await fs.unlink(dir);
  }
}

/**
 * @param   {string}  dir
 *          Path to a file or directory to destroy.
 * @return  {void}
 * @throws  {Error}
 */
export function nukeSync(dir: string)
: (never | void) {
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
