#!/usr/bin/env node

import * as log4js from "log4js";
import * as yargs from "yargs";
import chalk from "chalk";

export function getLogger(argv?: yargs.Arguments)
: (log4js.Logger) {
  const default_logger = log4js.getLogger("default");

  return typeof argv === "undefined" ? default_logger :
      argv.silent ? log4js.getLogger("silent") :
      argv.pretty ? log4js.getLogger("colour") :
      default_logger;
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

log4js.configure({
  appenders: {
    "colour": {
      type: "console",
      layout: {
        type: "pattern",
        pattern: `${chalk.yellow("ENOLA")} %[%p%]\t%m`
      }
    },
    "plain": {
      type: "console",
      layout: {
        type: "pattern",
        pattern: `ENOLA %p\t%m`
      }
    }
  },
  categories: {
    "colour": {
      appenders: ["colour"],
      level: log4js.levels.ALL.toString()
    },
    "default": {
      appenders: ["plain"],
      level: log4js.levels.ALL.toString()
    },
    "silent": {
      appenders: ["plain"],
      level: log4js.levels.OFF.toString()
    }
  }
});

process.once("beforeExit", function (ev) {
  const logger = getLogger();

  log4js.shutdown(function (err) {
    if (err) logger.error(err);
  });
});
