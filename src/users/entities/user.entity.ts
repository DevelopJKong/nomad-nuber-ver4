import type { NonAttribute } from 'kysely-typeorm';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, IsEnum } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
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
  @Field((_type) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((_type) => String)
  @Column({ select: false })
  @IsString()
  password: string;

  @Field((_type) => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Field((_type) => Boolean)
  @Column({ default: false })
  verified: boolean;

  @Field((_type) => Restaurant)
  @OneToMany((_type) => Restaurant, (restaurants) => restaurants.owner)
  restaurants: NonAttribute<Restaurant[]>;

  // ! kysely-typeorm 과 함께 사용했을때 문제가 생김
  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword(): Promise<void> {
  //   if (this.password) {
  //     try {
  //       this.password = await bcrypt.hash(this.password, 10);
  //     } catch (error) {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }

  // async checkPassword(aPassword: string): Promise<boolean> {
  //   try {
  //     const ok = await bcrypt.compare(aPassword, this.password);
  //     return ok;
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }
}
