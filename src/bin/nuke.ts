#!/usr/bin/env node

import { NukeResult, nuke } from "../system/fs/nuke";
import * as index from "./index";

import { cwd } from "./../system/cwd";

export function timedNuke(dir: string)
: (Promise<{
  elapsed: number;
  result: NukeResult;
  err?: any;
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
  const paths = argv._
      .slice(2)
      .map(cwd);

  const promises = paths
      .map((x) => ({
        timestamp: process.hrtime(),
        promise: nuke(x),
        path: x
      }))
      .map((x) => {
        function pc(res: NukeResult) {
          res.children.forEach(pc);
          if (res.warn) logger.warn(`(${res.warn.code}) ${res.warn.message}`);
          if (res.success) logger.info("Nuked " + res.path);
        }

        return x.promise.then((res) => {
          const elapsed = process.hrtime(x.timestamp);
          const seconds = elapsed[0] + elapsed[1] * 1e-12;
          pc(res);

          logger.debug(`took ${seconds.toFixed(12)} seconds`);
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
