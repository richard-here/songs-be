import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Jane',
    description: 'The first name of the User',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the User',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'janedoe@gmail.com',
    description: 'The email of the User',
  })
  @Column({ unique: true})
  email: string;

  @ApiProperty({
    example: 'test123#@',
    description: 'The password of the User',
  })
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column()
  apiKey: string;
}