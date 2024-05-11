import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4();

    const salt = await bcrypt.genSalt(); // 2.
    user.password = await bcrypt.hash(userDTO.password, salt); // 3.

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  findById(id: number) : Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async updateSecretKey(userId: number, secret: string) : Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      { twoFASecret: secret, enable2FA: true }
    )
  }

  async disable2FA(userId: number) : Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      { twoFASecret: null, enable2FA: false }
    )
  }

  async findByApiKey(apiKey: string) : Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
