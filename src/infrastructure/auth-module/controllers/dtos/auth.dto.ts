import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class SignInWithEmailDto {
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'admin' })
  username: string;

  @IsString()
  @ApiProperty({ type: String, required: true, example: 'admin' })
  password: string;
}

export class TokenPresenterDto {
  @Expose()
  @ApiProperty({ type: String, required: true, example: 'Bearer token' })
  access_token: string;
}
