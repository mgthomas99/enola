#!/usr/bin/env node

import { nuke } from "../system/fs/nuke";
import * as index from "./index";

export function timedNuke(dir: string)
: (Promise<{
  elapsed: number;
  path: string;
}>) {
  const start = process.hrtime();

  return nuke(dir).then(() => {
    const elapsed = process.hrtime(start);
    const seconds = elapsed[0] + elapsed[1] * 1e-12;

    return ({
      elapsed: seconds,
      path: dir
    });
  });
}

const promises = index.argv._.slice(2)
    .map((dir) => index.cwdJoin(dir))
    .map((dir) => timedNuke(dir)
        .then(function (x) {
          const elapsed = x.elapsed.toFixed(12);
          index.logger.info(`Nuked ${dir} in ${elapsed} seconds!`);
        }));

Promise.all(promises)
    .then(() => void index.logger.info("Done!"))
    .catch((err) => void index.logger.error(err));
