import memorize from '@common/decorators/Memorize';
import IPaginationParams from '@common/interfaces/IPaginationParams';
import { Request } from 'express';

export default class Helpers {
  /**
   * Private constructor to prevent instantiation of the Helpers class.
   * @throws - {@link Error}
   * Throws an error with a message indicating that the Helpers class cannot be instantiated.
   */
  private constructor() {
    throw new Error('Helpers class cannot be instantiated.');
  }

  /**
   * Generates an array of SQL order-by clauses based on the provided array of field and direction parameters.
   *
   * @param orderByParams - An array of strings representing field and direction parameters in the format "field:direction".
   * @returns An array of SQL order-by clauses in the format "field direction" (e.g., "columnName asc").
   */
  @memorize
  public static generateOrderByClauses(orderByParams: Array<string>): Array<string> {
    const orderByClauses: Array<string> = [];
    orderByParams.forEach(fieldWithDirection => {
      const [field, dir] = fieldWithDirection.split(':');
      const direction = dir === 'desc' ? 'desc' : 'asc';
      if (field) {
        orderByClauses.push(`${field} ${direction}`);
      }
    });
    return orderByClauses;
  }

  /**
   * Formats an error message by replacing placeholders with values from the replacements array.
   *
   * @param errorMessage - The error message with placeholders in the form of `{0}`, `{1}`, etc.
   * @param replacements - An array of values to replace the corresponding placeholders in the error message.
   * @returns The formatted error message with placeholders replaced.
   */
  public static formatErrorMessage(errorMessage: string, replacements: Array<any>): string {
    return errorMessage.replace(/{\d+}/g, match => {
      const position = parseInt(match.match(/\d+/)[0], 10);
      return replacements[position] !== undefined ? replacements[position] : match;
    });
  }

  /**
   * Checks if a given string matches any value in the specified enumeration type.
   *
   * @param value - The string value to be checked against the enumeration.
   * @param enumType - The enumeration type (enum) to compare the value against.
   * @returns True if the provided value matches any value in the enumeration; otherwise, false.
   */
  public static stringMatchesEnumValue(value: string, enumType: any): boolean {
    return Object.values(enumType).includes(value as any);
  }

  /**
   * Extract the pagination params from request query string.
   *
   * @param request - The express Request objects.
   * @returns The Request pagination Params or Default values for Request pagination.
   */
  public static extractPaginationParamsFromRequest(request: Request): IPaginationParams {
    const page = request.query.page ? Number(request.query.page) || 0 : 0;
    const perPage = request.query.perPage ? Number(request.query.perPage) || 15 : 15;
    const orderBy = request.query.orderBy ? String(request.query.orderBy) || null : null;

    return {
      page,
      perPage,
      orderBy: orderBy ? orderBy.split(',') : [],
    };
  }
}
