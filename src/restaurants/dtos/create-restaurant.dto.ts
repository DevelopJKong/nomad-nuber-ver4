import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, ['address', 'name', 'coverImg']) {}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
