import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
