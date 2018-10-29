#!/usr/bin/env node

import * as log4js from "log4js";

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

const argv = index.argh
    .scriptName("nuke")
    .usage("$0 <\"path\"> [\"path2\" [... \"pathN\"]]")
    .example("$0 \"./node_modules\"", "")
    .example("$0 \"./dir1\" \"dir2\" \"dir3\"", "")
    .example("$0 \"file.txt\"", "")
    .example("$0 \"./node_modules\" -p", "")
    .parse(process.argv);

const logger = index.getLogger(argv);

const paths = argv._.slice(2);
const promises = paths
    .map((dir) => index.cwdJoin(dir))
    .map((dir) => timedNuke(dir)
        .then(function (x) {
          const elapsed = x.elapsed.toFixed(12);
          logger.info(`Nuked '${dir}' in ${elapsed} seconds!`);
        }));

Promise.all(promises)
    .then(() => void logger.info("Done!"))
    .catch((err) => void logger.error(err));
