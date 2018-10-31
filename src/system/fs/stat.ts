import * as fs from "fs-extra";

export enum ResourceType {
  Directory,
  File,
  Symlink
}

export function statSyncSafe(dir: string)
: (fs.Stats | undefined) {
  try {
    const stat = fs.statSync(dir);
    return stat;
  } catch (ex) {
    return undefined;
  }
}

export function statSafe(dir: string)
: (Promise<fs.Stats | undefined>) {
  return new Promise((accept, reject) => {
    fs.stat(dir, (err, stats) => {
      if (err) accept(undefined);
      else accept(stats);
    });
  });
}
