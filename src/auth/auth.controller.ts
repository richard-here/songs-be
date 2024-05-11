import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth-guard';
import { Enable2FAType } from './types';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';

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
  ): Promise<{ accessToken: string } | { validate2FA: string, message: string }> {
    return this.authService.login(loginDTO);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Request()
    req
  ) : Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(
    @Request()
    req
  ) {
    return this.authService.disable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Request()
    req,
    @Body()
    ValidateTokenDTO: ValidateTokenDTO
  ) : Promise<{ verified: boolean } | { accessToken: string }> {
    console.log(req.user);
    return this.authService.validateToken(req.user.userId, ValidateTokenDTO.token);
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Request()
    req,
  ) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
