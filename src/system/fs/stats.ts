import * as fs from "fs-extra";

export function statSafe(dir: string)
: (Promise<fs.Stats>) {
  return new Promise((accept, reject) => {
    fs.stat(dir, (err, stats) => {
      if (err) accept(undefined);
      else accept(stats);
    });
  });
}
