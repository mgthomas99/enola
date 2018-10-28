import * as log4js from "log4js";
import * as path from "path";
import chalk from "chalk";

export function formatError(err: Error | string)
: (string) {
  const prefix = chalk.bgYellow("Enola");
  const type = chalk.redBright("ERR");
  const content = getErrorMessage(err);
  return `${prefix} ${type} ${content}`;
}

export function resolvePath(dir: string)
: (string) {
  const cwd = process.cwd();
  return path.join(cwd, dir);
}

export function getErrorMessage(err: Error | string)
: (string) {
  if (err instanceof Error) {
    return err.message;
  }
  return err;
}

log4js.configure({
  appenders: {
    "console": {
      layout: { type: "colored" },
      type: "console"
    }
  },
  categories: {
    "default": {
      appenders: ["console"],
      level: "error"
    }
  }
});

export const logger = log4js.getLogger("default");
