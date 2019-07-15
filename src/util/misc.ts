/**
 * Returns a function that checks if the given value is the same as the expected value.
 */
export function isExpected<T>(expected: T): (actual: T) => boolean {
  return actual => actual === expected;
}
