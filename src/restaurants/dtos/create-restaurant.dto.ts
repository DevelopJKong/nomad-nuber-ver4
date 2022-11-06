import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, ['address', 'name', 'coverImg']) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
