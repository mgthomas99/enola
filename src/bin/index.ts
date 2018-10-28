#!/usr/bin/env node

import * as log4js from "log4js";
import * as path from "path";
import * as yargs from "yargs";
import chalk from "chalk";

export function cwdJoin(dir: string)
: (string) {
  const cwd = process.cwd();
  return path.join(cwd, dir);
}

export const argh = yargs
    .boolean("pretty")
      .alias("pretty", "p")
      .default("pretty", true)
      .describe("pretty", "Output styling")
    .boolean("silent")
      .alias("silent", "s")
      .default("silent", false)
      .describe("silent", "Mute output")
    .alias("help", "h")
    .alias("version", "v");
export const argv = argh
    .parse(process.argv);

log4js.configure({
  appenders: {
    "console": {
      type: "console",
      layout: {
        type: "pattern",
        pattern: `%x{prefix} %[%p%]\t %m`,
        tokens: {
          prefix(ev: log4js.LoggingEvent)
          : (string) {
            return argv.pretty
                ? chalk.yellow("ENOLA")
                : "ENOLA";
          }
        }
      }
    }
  },
  categories: {
    "default": {
      appenders: ["console"],
      level: argv.silent
          ? log4js.levels.OFF.toString()
          : log4js.levels.ALL.toString()
    }
  }
});

export const logger = log4js.getLogger();

process.once("beforeExit", function (ev) {
  log4js.shutdown();
});
