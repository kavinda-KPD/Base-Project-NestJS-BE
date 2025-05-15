import { RoleModel } from './role.model';
import { TeamModel } from './team.model';

export class UserModel {
  id: string;

  userName: string;

  password: string;

  role: Partial<RoleModel>;

  team?: Partial<TeamModel>;
}
