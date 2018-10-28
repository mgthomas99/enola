import * as log4js from "log4js";
import * as path from "path";
import chalk from "chalk";

export const config = new Map<string, any>();

export function resolvePath(dir: string)
: (string) {
  const cwd = process.cwd();
  return path.join(cwd, dir);
}

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
            return config.get("pretty")
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
      level: "all"
    }
  }
});

export const logger = log4js.getLogger("default");
