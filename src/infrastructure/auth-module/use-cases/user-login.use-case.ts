import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserAccountRepositoryInterface } from 'src/domain/repositories/user-account.repository-interface';
import { IUseCase } from 'src/infrastructure/abstract/use-case.interface';
import { ISUserAccountRepository } from 'src/infrastructure/interface-symbols/repository.symbols';
import { PasswordService } from '../services/password.service';
import { JwtService } from '@nestjs/jwt';
interface IUserLoginParams {
  username: string;
  password: string;
}

export interface IUserLoginUseCase extends IUseCase<IUserLoginParams, string> {}

@Injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    @Inject(ISUserAccountRepository)
    private readonly _userAccountRepository: IUserAccountRepositoryInterface,

    private readonly _passwordService: PasswordService,

    private readonly _jwtService: JwtService,
  ) {}

  async execute({ username, password }: IUserLoginParams): Promise<string> {
    //check the user exists
    const existingUser =
      await this._userAccountRepository.findUserByUserName(username);

    if (!existingUser)
      throw new UnauthorizedException(
        `User not found in username ${username}.`,
      );

    const { password: hashedPassword } = existingUser;

    const matchingPassword =
      await this._passwordService.compareWithHashedPassword(
        password,
        hashedPassword,
      );

    if (!matchingPassword) throw new UnauthorizedException('Invalid password.');

    //if password matches, generate a jwt token and return it.
    const tokenPayload = {
      useId: existingUser.id,
      name: existingUser.userName,
      role: existingUser.role.name,
    };

    return await this._jwtService.signAsync(tokenPayload);
  }
}
