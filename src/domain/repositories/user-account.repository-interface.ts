import { UserModel } from '../models/user.model';
import { IMainRepositoryInterface } from './main-repository.interface';

export interface IUserAccountRepositoryInterface
  extends IMainRepositoryInterface<UserModel> {
  checkAdminExists(): Promise<UserModel>;

  findUserByUserName(username: string): Promise<UserModel>;
}
