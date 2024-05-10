import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post('signup')
  signup(
    @Body()
    userDTO: CreateUserDTO
  ): Promise<User> {
    return this.usersService.create(userDTO);
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginDTO);
  }
}