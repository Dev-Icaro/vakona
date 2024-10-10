/**
 * Generic interface representing a service with an execute method.
 *
 * @typeparam T - The type of the result returned by the execute method.
 */
export default interface IService<T> {
  /**
   * Executes the service with the provided arguments and returns a Promise.
   *
   * @param args - The arguments needed for the service execution.
   * @returns A Promise that resolves to the result of the service execution.
   */
  execute(...args: unknown[]): Promise<T>;
}
