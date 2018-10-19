import * as log4js from "log4js";
import * as yargs from "yargs";
import chalk from "chalk";

import { ErrorInformation } from "../system/error-information";

export function formatError(err: ErrorInformation | Error | string)
: string {
  const prefix = chalk.bgYellow("Enola");
  const type = chalk.redBright("ERR");
  const content = getErrorMessage(err);
  return `${prefix} ${type} ${content}`;
}

export function getErrorMessage(err: ErrorInformation | Error | string)
: string {
  if (err instanceof Error || typeof err !== "string") {
    return err.message;
  }
  return err;
}

export const argv = yargs
    .parse(process.argv);

export const error_logger = log4js.getLogger("err");
