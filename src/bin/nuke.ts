import * as path from "path";

import { Errors } from "../system/errors";
import { nuke } from "./../nuke";
import {
  argv,
  error_logger,
  formatError
} from "./context";

for (const dir of argv._.slice(2)) {
  nuke(dir)
      .then(() => console.info("Done!"))
      .catch((err) => {
        const info = Errors.get(err.code);
        const text = formatError(info.message);
        error_logger.error(`${text}`);
      });
}
