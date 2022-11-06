import { LoggerService } from 'src/logger/logger.service';
import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/categories.repository';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category) private readonly categories: CategoryRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async createRestaurant(owner: User, createRestaurantInput: CreateRestaurantInput) {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;

      const category: Category = (await this.categories.getOrCreateCategory(
        createRestaurantInput.categoryName,
      )) as Category;

      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);

      // * 👍 success
      this.loggerService.logger().info(this.loggerService.loggerInfo('레스토랑 생성 완료'));
      return {
        ok: true,
      };
    } catch (error) {
      //! 📢 error 예상치 못한 에러 발생
      const { message, name, stack } = error;
      this.loggerService.logger().error(this.loggerService.loggerInfo('레스토랑 생성 오류', message, name, stack));
      return {
        ok: false,
        error: '레스토랑 생성 오류',
      };
    }
  }
}
