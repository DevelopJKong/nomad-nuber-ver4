import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Args, ArgsType, Mutation, Resolver } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(@AuthUser() authUser: User, @Args('input') createRestaurantInput: CreateRestaurantInput) {
    return this.restaurantsService.createRestaurant(authUser, createRestaurantInput);
  }
}
