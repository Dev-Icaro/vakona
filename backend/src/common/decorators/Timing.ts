import logger from '@common/utils/logger';

/**
 * Decorator function for measuring the execution time of a method and logging the result.
 */
export default function timing(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const startTime = Date.now();
    const result = originalMethod.apply(this, args);
    const endTime = Date.now();
    logger.debug(`Method ${key} took ${endTime - startTime} ms to execute`);
    return result;
  };

  return descriptor;
}
