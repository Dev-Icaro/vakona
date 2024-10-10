/**
 * Interface representing parameters for pagination.
 */
export default interface IPaginationParams {
  /**
   * The page number to retrieve.
   */
  page: number;

  /**
   * The number of items per page.
   */
  perPage: number;

  /**
   * An array of strings representing the fields to use for sorting.
   * Each string can include an optional direction (e.g., "fieldName:asc" or "fieldName:desc").
   */
  orderBy: Array<string>;
}
