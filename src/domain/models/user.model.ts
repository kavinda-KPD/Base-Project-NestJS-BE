import { RoleModel } from './role.model';

export class UserModel {
  id: string;

  userName: string;

  password: string;

  role: Partial<RoleModel>;
}
