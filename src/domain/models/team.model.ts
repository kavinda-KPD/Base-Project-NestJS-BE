import { UserModel } from './user.model';

export class TeamModel {
  id: string;

  name: string;

  description?: string;

  leader: Partial<UserModel>;

  users: Partial<UserModel>[];
}
