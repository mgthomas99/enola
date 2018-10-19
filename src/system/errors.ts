import { ErrorInformation } from "./error-information";

export const Errors = new Map<string, ErrorInformation>([
  ["EPERM", {
    errno: -4048,
    code: "EPERM",
    message: "You do not have write access to this directory"
  }]
]);
