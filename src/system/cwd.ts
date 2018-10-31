import * as path from "path";

/**
 * Join all arguments using the operating system's path separator, and append
 * the result to the current working directory.
 *
 * @param   {string}  dir
 *          The strings to join using the operating system's path separator.
 * @return  {string}
 *          The path.
 */
export function cwd(...dir: string[])
: (string) {
  return path.join(
      process.cwd(),
      ...dir
    );
}
