import * as path from "path";

export function cwd(dir?: string)
: (string) {
  return path.join(
      process.cwd(),
      dir
    );
}
