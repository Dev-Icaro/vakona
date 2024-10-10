/**
 * Decorator function for memorizing the result of a method based on its arguments.
 * It saves the result of the method in a memo object and returns the saved result if the method is called again with the same arguments.
 *
 * @remarks
 * This decorator is useful for methods that are called multiple times with the same arguments.
 */
export default function memorize(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const memo: { [key: string]: any } = {};

  descriptor.value = function (...args: any[]) {
    const argString = JSON.stringify(args);

    if (!memo[argString]) {
      memo[argString] = originalMethod.apply(this, args);
    }

    return memo[argString];
  };

  return descriptor;
}
