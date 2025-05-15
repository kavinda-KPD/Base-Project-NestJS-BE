import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserModel } from 'src/domain/models/user.model';
import { IUserAccountRepositoryInterface } from 'src/domain/repositories/user-account.repository-interface';
import { EntityManager, DeepPartial, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleType } from 'src/domain/enums/user-role.enum';
import { Mapper } from '../utils/mappers/mapper.util';

@Injectable()
export class UserAccountRepository implements IUserAccountRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userAccountRepository: Repository<UserEntity>,
  ) {}
  async findUserByUserName(username: string): Promise<UserModel> {
    const user = await this._userAccountRepository.findOne({
      where: {
        userName: username,
      },
      relations: {
        role: true,
      },
    });

    return Mapper.toModel(user, UserModel) as UserModel;
  }
  async checkAdminExists(): Promise<UserModel> {
    const admin = await this._userAccountRepository.findOne({
      where: {
        role: {
          name: UserRoleType.ADMIN,
        },
      },
      relations: {
        role: true,
      },
    });

    return Mapper.toModel(admin, UserModel);
  }

  findById(id: string): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }
  async update(
    userAccount: DeepPartial<UserModel>,
    entityManager?: EntityManager,
  ): Promise<UserModel> {
    let userAccountInstance = plainToInstance(UserEntity, userAccount);

    userAccountInstance =
      this._userAccountRepository.create(userAccountInstance);

    let createdUserAccount: UserEntity;

    if (entityManager) {
      createdUserAccount = await entityManager.save(
        UserEntity,
        userAccountInstance,
      );
    } else {
      createdUserAccount =
        await this._userAccountRepository.save(userAccountInstance);
    }

    return plainToInstance(UserModel, createdUserAccount);
  }

  async create(
    userAccount: DeepPartial<UserModel>,
    entityManager?: EntityManager,
  ): Promise<UserModel> {
    let userAccountInstance = plainToInstance(UserEntity, userAccount);

    userAccountInstance =
      this._userAccountRepository.create(userAccountInstance);

    let createdUserAccount: UserEntity;

    if (entityManager) {
      createdUserAccount = await entityManager.save(
        UserEntity,
        userAccountInstance,
      );
    } else {
      createdUserAccount =
        await this._userAccountRepository.save(userAccountInstance);
    }

    return plainToInstance(UserModel, createdUserAccount);
  }
  saveMany(
    t: UserModel[],
    entityManager?: EntityManager,
  ): Promise<UserModel[]> {
    throw new Error('Method not implemented.');
  }
  findByIds(ids: string[]): Promise<UserModel[]> {
    throw new Error('Method not implemented.');
  }
}
