import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from 'src/domain/models/role.model';
import { IRoleRepositoryInterface } from 'src/domain/repositories/role.repository-interface';
import { EntityManager, DeepPartial, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import {
  classToPlain,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Mapper } from '../utils/mappers/mapper.util';

@Injectable()
export class RoleRepository implements IRoleRepositoryInterface {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roleRepository: Repository<RoleEntity>,
  ) {}
  async fetchRoleByName(name: string): Promise<RoleModel> {
    const role = await this._roleRepository.findOne({ where: { name: name } });

    return Mapper.toModel(role, RoleModel);
  }

  async findAll(): Promise<RoleModel[]> {
    const roles = await this._roleRepository.find();

    return Mapper.toModels(roles, RoleModel);
  }

  findById(id: string): Promise<RoleModel> {
    throw new Error('Method not implemented.');
  }
  async update(
    role: DeepPartial<RoleModel>,
    entityManager?: EntityManager,
  ): Promise<RoleModel> {
    let roleInstance = Mapper.toEntity(role, RoleEntity);

    roleInstance = this._roleRepository.create(roleInstance);

    let createdRole: RoleEntity;

    if (entityManager) {
      createdRole = await entityManager.save(RoleEntity, roleInstance);
    } else {
      createdRole = await this._roleRepository.save(roleInstance);
    }

    return Mapper.toModel(createdRole, RoleModel) as RoleModel;
  }

  //create the role
  async create(
    role: DeepPartial<RoleModel>,
    entityManager?: EntityManager,
  ): Promise<RoleModel> {
    let roleInstance = Mapper.toEntity(role, RoleEntity);

    roleInstance = this._roleRepository.create(roleInstance);

    let createdRole: RoleEntity;

    if (entityManager) {
      createdRole = await entityManager.save(RoleEntity, roleInstance);
    } else {
      createdRole = await this._roleRepository.save(roleInstance);
    }

    return Mapper.toModel(createdRole, RoleModel) as RoleModel;
  }
  async saveMany(
    roles: RoleModel[],
    entityManager?: EntityManager,
  ): Promise<RoleModel[]> {
    let roleInstances = Mapper.toEntities(roles, RoleEntity);

    roleInstances = roleInstances.map((role) =>
      this._roleRepository.create(role),
    );

    let createdRoles: RoleEntity[] = [];

    if (entityManager) {
      createdRoles = await entityManager.save(RoleEntity, roleInstances);
    } else {
      createdRoles = await this._roleRepository.save(roleInstances);
    }

    return Mapper.toModels(createdRoles, RoleModel) as RoleModel[];
  }

  findByIds(ids: string[]): Promise<RoleModel[]> {
    throw new Error('Method not implemented.');
  }
}
