import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantsService {
  constructor(@InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>) {}

  async createRestaurant(owner: User, createRestaurantInput: CreateRestaurantInput) {
    try {
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '레스토랑을 생성 할 수 없습니다',
      };
    }
  }
}
