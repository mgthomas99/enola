#!/usr/bin/env node

import * as yargs from "yargs";

import { nuke } from "../system/fs/nuke";
import { explode } from "../explode";
import * as index from "./index";

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

const paths = argv._.slice(2);
const promises = paths.map(x => nuke(x));
const start = process.hrtime();
Promise.all(promises)
    .then(() => {
      const elapsed = process.hrtime(start);
      const seconds = elapsed[0] + elapsed[1] / 1e9;

      explode();
      console.log(`Took ${seconds} seconds!`);
    })
    .catch((err) => index.logger.error(err));
