import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayloadType } from './types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService, 
  ) {}

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string, tempToken: string, message: string }> {
    const user = await this.usersService.findOne(loginDTO);

    const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);
    if (passwordMatched) {
      delete user.password;
      const payload : PayloadType = { email: user.email, userId: user.id };
      const artist = await this.artistService.findArtist(user.id);
      if (artist) {
        payload.artistId = artist.id;
      }

      if (user.enable2FA && user.twoFASecret) {
        const tempToken = this.jwtService.sign(payload, { expiresIn: '1m'});
        return {
          validate2FA: 'http://localhost:3000/validate-2fa',
          tempToken,
          message: 'Please validate 2FA'
        };
      }
      return {
        accessToken: this.jwtService.sign(payload)
      };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }

  async enable2FA(userId: number) : Promise<Enable2FAType> {
    const user = await this.usersService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    user.twoFASecret = secret.base32;
    await this.usersService.updateSecretKey(userId, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: number) : Promise<UpdateResult> {
    return this.usersService.disable2FA(userId);
  }

  async validateToken(
    userId: number,
    token: string
  ) : Promise<{ verified: boolean } | { accessToken: string }> {
    try {
      const user = await this.usersService.findById(userId);
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token
      });
      if (verified) {
        const payload : PayloadType = { email: user.email, userId: user.id };
        const artist = await this.artistService.findArtist(user.id);
        if (artist) {
          payload.artistId = artist.id;
        }
        return {
          accessToken: this.jwtService.sign(payload)
        };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }
}
