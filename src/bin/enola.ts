#!/usr/bin/env node

import * as index from "./index";

(function (argv) {
  const logger = index.getLogger(argv);

  index.argh.showHelp();
})(
  index.argh
      .parse(process.argv)
);
