import { Restaurant } from './restaurant.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';
import { NonAttribute } from 'kysely-typeorm';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((_type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((_type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  @Field((_type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((_type) => [Restaurant])
  @OneToMany((_type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: NonAttribute<Restaurant[]>;
}
