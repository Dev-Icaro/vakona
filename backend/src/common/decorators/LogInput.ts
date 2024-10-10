import logger from '@common/utils/logger';

/**
 * A decorator function that logs input arguments before executing the decorated method.
 */
export default function logInput(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const className = target.constructor.name;
    logger.debug(`Input arguments for ${className}.${propertyKey}: \n${JSON.stringify(args)}`);
    const result = originalMethod.apply(this, args);
    return result;
  };

  return descriptor;
}
