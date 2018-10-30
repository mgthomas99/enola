import * as fs from "fs-extra";
import * as path from "path";

import * as stat from "./stat";

export type NukeResult = ({
  children: NukeResult[];
  path: string;
  err?: {
    errno: number;
    code: string;
    message?: string;
  };
});

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
 * @return  {Promise<NukeResult>}
 *          A `Promise` which is resolved once the item has been destroyed, or
 *          rejected if a system error occurs.
 */
export async function nuke(dir: string)
: (Promise<NukeResult>) {
  const stats = await stat.statSafe(dir);
  const result: NukeResult = ({
    children: [],
    path: dir
  });

  if (typeof stats === "undefined") {
    result.err = ({
      errno: 1,
      code: "ENOTEXIST",
      message: `'${dir}' does not exist. Skipping!`
    });
  } else if (stats.isDirectory()) {
    const files = (await fs.readdir(dir))
        .map(x => path.join(dir, x));
    const callbacks = files
        .map(x => nuke(x));

    const children = await Promise.all(callbacks);
    result.children.push(... children);

    await fs.rmdir(dir);
  } else if (stats.isFile()) {
    await fs.unlink(dir);
  }
  return result;
}

/**
 * Obliterate the file/directory at the specified path.
 *
 * If the path does not exist, this function will immediately return.
 *
 * @param   {string}  dir
 *          The path of the file/directory to destroy. The path can either be
 *          absolute, or relative to the current working directory.
 * @return  {NukeResult}
 * @throws  {Error}
 */
export function nukeSync(dir: string)
: (NukeResult | never) {
  const stats = stat.statSyncSafe(dir);
  const result: NukeResult = ({
    children: [],
    path: dir
  });

  if  (typeof stats === "undefined") {

  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(dir);
    files
        .map(x => path.join(dir, x))
        .map(x => nukeSync(x))
        .forEach((x) => {
          result.children.push(x);
        });
    fs.rmdirSync(dir);
  } else if (stats.isFile()) {
    fs.unlinkSync(dir);
  }
  return result;
}
