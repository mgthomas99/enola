import * as fs from "fs-extra";
import * as path from "path";

import { ResourceType } from "./../fs/stat";
import { Errors } from "./../errors";
import * as stat from "./stat";

/**
 * `nuke` operation information.
 */
export type NukeResult = ({
  /**
   * Information about the resource.
   */
  stats: {
    /** The path that was requested to be nuked. */
    path: string;

    /** The type of the resource. */
    type: ResourceType;
  };

  /** If the requested resource was a directory, this array will contain the
   * result of all nuke operations performed on the directory's items. */
  children: NukeResult[];

  /** A `boolean` whose value is `true` if the operation succeeded (i.e.,
   * produced the desired result) and `false` otherwise. */
  success: boolean;

  /** A warning that was produced by the operation, if one occured. */
  warn?: Errors;
});

/**
 * Asynchronously obliterate the file/directory at the specified path.
 *
 * If the file/directory does not exist, a warning will be returned. This is
 * because the operation is invalid, but the desired result of the operation has
 * been met.
 *
 * @param   {string}  path
 *          The path of the file/directory to destroy. The path can either be
 *          absolute, or relative to the current working directory.
 * @param   {boolean | undefined} exists
 *          Optional `boolean` parameter. If `false`, the function will return
 *          immediately. This parameter is automatically provided internally
 *          when this function is called recursively.
 * @return  {Promise<NukeResult>}
 *          A `Promise` which resolves to a `NukeResult` object containing
 *          information about the operation once the operation has completed.
 */
export async function nuke(dir: string)
: (Promise<NukeResult>) {
  const stats = await stat.statSafe(dir);
  const result: NukeResult = ({
    stats: {
      type: stat.getResourceType(stats),
      path: dir
    },
    children: [],
    success: true
  });

  if (typeof stats === "undefined") {
    result.warn = Errors.ResourceNotFound;
  } else if (stats.isDirectory()) {
    const files = (await fs.readdir(dir))
        .map(x => path.join(dir, x));
    const callbacks = files
        .map(x => nuke(x));

    const children = await Promise.all(callbacks);
    await fs.rmdir(dir);

    result.children.push(... children);
  } else if (stats.isFile()) {
    await fs.unlink(dir);
  }
  return result;
}

/**
 * Obliterate the file/directory at the specified path.
 *
 * If the file/directory does not exist, a warning will be returned. This is
 * because the operation is invalid, but the desired result of the operation has
 * been met.
 *
 * @param   {string}  dir
 *          The path of the file/directory to destroy. The path can either be
 *          absolute, or relative to the current working directory.
 * @return  {NukeResult}
 *          A `NukeResult` object containing information about the operation
 *          once the operation has completed.
 * @throws  {Error}
 */
export function nukeSync(dir: string)
: (NukeResult | never) {
  const stats = stat.statSyncSafe(dir);
  const result: NukeResult = ({
    stats: {
      type: stat.getResourceType(stats),
      path: dir
    },
    children: [],
    success: true
  });

  if (typeof stats === "undefined") {
    result.warn = Errors.ResourceNotFound;
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
