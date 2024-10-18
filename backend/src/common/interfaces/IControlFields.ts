/**
 * Interface representing control fields for tracking creation and update dates.
 */
export default interface IControlFields {
  /**
   * The date when the entity was created.
   */
  createdAt: Date;
  /**
   * The date when the entity was last updated.
   */
  updatedAt: Date;
}
