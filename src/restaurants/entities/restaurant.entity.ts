import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { NonAttribute } from 'kysely-typeorm';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((_type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((_type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((_type) => String)
  @Column()
  address: string;

  @Field((_type) => User)
  @ManyToOne((_type) => User, (owner) => owner.restaurants)
  owner: NonAttribute<User>;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @ManyToOne((_type) => Category, (category: Category) => category.restaurants)
  category: NonAttribute<Category>;

  @Field((_type) => Boolean)
  @Column({ default: false })
  isPromoted: boolean;

  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntil: Date;
}
