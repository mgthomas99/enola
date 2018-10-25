#!/usr/bin/env node

import { Errors } from "../system/errors";
import { nuke } from "../system/fs/nuke";
import * as context from "./context";

for (const dir of context.argv._.slice(2)) {
  nuke(dir)
      .then(() => console.info(`Nuked ${dir}!`))
      .catch((err) => {
        const info = Errors.get(err.code);
        const text = context.formatError(info.message);
        context.error_logger.error(`${text}`);
      });
}
