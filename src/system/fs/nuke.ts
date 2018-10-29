import * as fs from "fs-extra";
import * as path from "path";

import * as stat from "./stats";

/**
 * Asynchronously obliterate the file/directory at the specified path.
 *
 * If the path does not exist, this function will immediately return.
 *
 * @param   {string}  path
 *          The path of the file/directory to destroy. The path can either be
 *          absolute, or relative to the current working directory.
 * @param   {boolean | undefined} exists
 *          Optional `boolean` parameter. If `false`, the function will return
 *          immediately. This parameter is automatically provided internally
 *          when this function is called recursively.
 * @return  {Promise<void>}
 *          A `Promise` which is resolved once the item has been destroyed, or
 *          rejected if a system error occurs.
 */
export async function nuke(dir: string)
: (Promise<void>) {
  const stats = await stat.statSafe(dir);
  if (typeof stats === "undefined") {
    return;
  }

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
 * Obliterate the file/directory at the specified path.
 *
 * If the path does not exist, this function will immediately return.
 *
 * @param   {string}  dir
 *          The path of the file/directory to destroy. The path can either be
 *          absolute, or relative to the current working directory.
 * @return  {void}
 * @throws  {Error}
 */
export function nukeSync(dir: string)
: (never | void) {
  const stats = stat.statSyncSafe(dir);
  if  (typeof stats === "undefined") {
    return;
  }

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
