/**
 * Interface representing pagination information.
 */
export default interface IPaginationInfo {
  /**
   * The number of items per page.
   */
  perPage: number;

  /**
   * The total number of items across all pages.
   */
  total: number;

  /**
   * The current page number.
   */
  currentPage: number;
}
