import { TeamModel } from '../models/team.model';
import { IMainRepositoryInterface } from './main-repository.interface';

export interface ITeamRepositoryInterface
  extends IMainRepositoryInterface<TeamModel> {
  retrieveAllTeams(
    page: number,
    limit: number,
    name?: string,
    isLeaderAssigned?: boolean,
    leaderId?: string,
  ): Promise<[TeamModel[], number]>;

  findTeamByIdWithTeamLeader(id: string): Promise<TeamModel>;
}
