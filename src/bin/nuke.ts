#!/usr/bin/env node

import * as yargs from "yargs";

import { nuke } from "../system/fs/nuke";
import { explode } from "../explode";
import * as index from "./index";

function cbify(dir: string)
: (Promise<{
  elapsed: number;
  path: string;
}>) {
  const a = process.hrtime();

  return nuke(dir).then(() => {
    const elapsed = process.hrtime(a);
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

const promises = argv._.slice(2)
    .map(index.resolvePath)
    .map(cbify);

Promise.all(promises)
    .then((values) => {
      explode();

      values.forEach((x) => {
        console.log(`Nuked ${x.path} in ${x.elapsed.toFixed(12)} seconds!`);
      });
    })
    .catch((err) => index.logger.error(err));
