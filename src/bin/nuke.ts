#!/usr/bin/env node

import * as yargs from "yargs";

import { nuke } from "../system/fs/nuke";
import * as index from "./index";

function cbify(dir: string)
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

const argv = yargs
    .boolean("pretty")
      .alias("pretty", "p")
      .default("pretty", true)
      .describe("pretty", "Output styling")
    .boolean("silent")
      .alias("silent", "s")
      .default("silent", false)
      .describe("silent", "Mute output")
    .parse(process.argv);

index.config.set("pretty", argv.pretty);
index.config.set("silent", argv.silent);

const promises = argv._.slice(2)
    .map(index.resolvePath)
    .map((dir) => cbify(dir)
        .then(function (x) {
          const elapsed = x.elapsed.toFixed(12);
          index.logger.info(`Nuked ${dir} in ${elapsed} seconds!`);
        }));

Promise.all(promises)
    .then(() => void index.logger.info("Done!"))
    .catch((err) => void index.logger.error(err));
