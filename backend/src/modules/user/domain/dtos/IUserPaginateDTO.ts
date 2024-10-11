import IPaginationInfo from '@common/interfaces/IPaginationInfo';
import IUserDTO from './IUserDTO';

export default interface IUserPaginateDTO extends IPaginationInfo {
  data: IUserDTO[];
}
