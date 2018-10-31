
/**
 * An enumeration containing system errors that may occur when invoking a
 * function implemented by the Enola library.
 */
export enum Errors {

  /**
   * Access to the resource failed as the resource could not be found.
   */
  ResourceNotFound,

  /**
   * The resource could not be modified as it is in use by another process.
   */
  ResourceLocked

}

/**
 * Returns a standard error message that explains the specified `Errors`.
 *
 * If the error cannot be recognised, this function will return an unhelpful
 * message.
 *
 * @param   {Errors | number}  err
 *          The error type.
 * @return  {string}
 *          A message describing the error.
 */
export function getDefaultErrorMessage(err?: Errors)
: (string) {
  switch (err) {
    case Errors.ResourceNotFound:
      return "The resource could not be found";
    case Errors.ResourceLocked:
      return "The resource is in use";
    default:
      return "Unknown error";
  }
}
