import logger from '@common/utils/logger';

/**
 * Decorator function for logging method entry and exit points.
 */
export default function tail(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const className = target.constructor.name;
    logger.debug(`Enter ${className}.${propertyKey}`);
    const result = originalMethod.apply(this, args);
    logger.debug(`Exit ${className}.${propertyKey}`);
    return result;
  };

  return descriptor;
}
