#!/usr/bin/env node

import { nukeSync } from "../system/fs/nuke";
import * as context from "./context";

for (const dir of context.argv._.slice(2)) {
  nukeSync(dir);
}
