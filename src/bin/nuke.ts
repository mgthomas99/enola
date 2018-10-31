#!/usr/bin/env node

import { NukeResult, nuke } from "../system/fs/nuke";
import * as index from "./index";

import { cwd } from "./../system/cwd";
import { Errors } from "./../system/errors";
import * as error from "./../system/errors";

export function timedNuke(dir: string)
: (Promise<{
  elapsed: number;
  result: NukeResult;
  err?: Errors;
}>) {
  const start = process.hrtime();

  return nuke(dir)
      .then(function (result) {
        const elapsed = process.hrtime(start);
        const seconds = elapsed[0] + elapsed[1] * 1e-12;

        return ({
          elapsed: seconds,
          warn: result.warn,
          result,
        });
      });
}

(function (argv) {
  const logger = index.getLogger(argv);
  const paths = argv._.slice(2)
      .map(x => cwd(x));

  const promises = paths
      .map((x) => ({
        timestamp: process.hrtime(),
        path: x,
        promise: nuke(x)
      }))
      .map((x) => x.promise.then((res) => {
        const elapsed = process.hrtime(x.timestamp);

        return ({
          elapsed: elapsed[0] + elapsed[1] * 1e-12,
          timestamp: x.timestamp,
          path: x.path,
          result: res
        });
      }))
      .map((x) => {
        function printChildren(res: NukeResult) {
          res.children.forEach(printChildren);
          if (res.warn) {
            const message = error.getDefaultErrorMessage(res.warn);
            logger.warn(message);
          }
          if (res.success) {
            logger.info(`Nuked ${res.stats.path}`);
          }
        }

        return x.then((res) => {
          printChildren(res.result);

          logger.debug(`Took ${res.elapsed.toFixed(12)} seconds`);
        });
      });

  Promise.all(promises)
      .then(() => void logger.info("Done!"))
      .catch((err) => void logger.error(err));
})(
  index.argh
      .scriptName("nuke")
      .usage("$0 <\"path\"> [\"path2\" [... \"pathN\"]]")
      .example("$0 \"./node_modules\"", "Delete directory \"./node_modules\"")
      .example("$0 \"./dir1\" \"./dir2\" \"./dir3\"", "Delete directories \"./dir1\", \"dir2\", and \"dir3\"")
      .example("$0 \"file.txt\"", "Delete file \"file.txt\"")
      .example("$0 \"./node_modules\" -p", "Delete directory \"./node_modules\", with pretty output")
      .parse(process.argv)
);
