import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, IsEnum } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}
registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  //constructor(private readonly loggerService: LoggerService) {}
  @Field((type) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ select: false })
  @IsString()
  password: string;

  @Field((type) => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Field((type) => Boolean)
  @Column({ default: false })
  verified: boolean;

  @Field((type) => Restaurant)
  @OneToMany((type) => Restaurant, (restaurants) => restaurants.owner)
  restaurants: Restaurant[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
