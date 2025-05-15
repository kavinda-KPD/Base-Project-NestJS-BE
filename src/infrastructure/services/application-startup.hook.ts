import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  ISRoleRepository,
  ISUserAccountRepository,
} from '../interface-symbols/repository.symbols';
import { IRoleRepositoryInterface } from 'src/domain/repositories/role.repository-interface';
import { USER_ROLES, UserRoleType } from 'src/domain/enums/user-role.enum';
import { RoleModel } from 'src/domain/models/role.model';
import * as fs from 'fs';
import * as path from 'path';
import { IUserAccountRepositoryInterface } from 'src/domain/repositories/user-account.repository-interface';
import { UserModel } from 'src/domain/models/user.model';
import { PasswordService } from '../auth-module/services/password.service';

@Injectable()
export class ApplicationStartupHook implements OnApplicationBootstrap {
  // Logger instance initialization
  private readonly logger: Logger;
  constructor(
    @Inject(ISRoleRepository)
    private readonly _roleRepository: IRoleRepositoryInterface,

    @Inject(ISUserAccountRepository)
    private readonly _userAccountRepository: IUserAccountRepositoryInterface,

    private readonly _passwordService: PasswordService,
  ) {
    // Logger service
    this.logger = new Logger(ApplicationStartupHook.name);
  }

  async onApplicationBootstrap() {
    // populate the database with roles on application startup
    await this.populateSystemRoles();

    // populate admin role
    await this.populateAdminRole();

    // populate the image folder if not exists
    await this.createImageFolderIfNotExist();
  }

  private async populateSystemRoles() {
    const roles = USER_ROLES;

    //fetch all the roles in the db
    const allRoles = await this._roleRepository.findAll();

    //get the missing roles
    const missingRoles = roles.filter((role) => {
      return !allRoles.find((r) => r.name === role);
    });

    let createdRoles: RoleModel[] = [];

    //create the missing roles
    missingRoles.forEach((role) => {
      const roleInstance = new RoleModel();
      roleInstance.name = role;

      createdRoles.push(roleInstance);
    });

    missingRoles.length > 0 &&
      (await this._roleRepository.saveMany(createdRoles));
  }

  private async createImageFolderIfNotExist() {
    // Get the path where the terminal is run (root of the project)
    const rootPath = path.join(process.cwd(), 'images');

    // Check if the folder exists
    if (!fs.existsSync(rootPath)) {
      // Create the folder if it doesn't exist
      fs.mkdirSync(rootPath, { recursive: true });
      this.logger.log(`Images folder created at: ${rootPath}`);
    } else {
      // The folder already exists so do nothing
      this.logger.log('Images folder already exists');
    }
  }

  private async populateAdminRole() {
    //check if admin role exists
    const admin = await this._userAccountRepository.checkAdminExists();

    //if admin role doesn't exist, create it
    if (!admin) {
      const adminRole = await this._roleRepository.fetchRoleByName(
        UserRoleType.ADMIN,
      );

      const hashedPassword = await this._passwordService.hashPassword('admin');

      const admin = new UserModel();
      admin.userName = 'admin';
      admin.password = hashedPassword;
      admin.role = adminRole;

      console.log(admin);

      await this._userAccountRepository.create(admin);
    }
  }
}
