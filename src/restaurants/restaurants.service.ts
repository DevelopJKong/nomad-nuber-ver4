import { EditRestaurantInput } from './dtos/edit-restaurant.dto';
import { EditProfileInput } from './../users/dtos/edit-profile.dto';
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
        createRestaurantInput.coverImg,
      )) as Category;

      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);

      // * π success
      this.loggerService.logger().info(this.loggerService.loggerInfo('λ μ€ν λ μμ± μλ£'));
      return {
        ok: true,
      };
    } catch (error) {
      //! π’ error μμμΉ λͺ»ν μλ¬ λ°μ
      const { message, name, stack } = error;
      this.loggerService
        .logger()
        .error(this.loggerService.loggerInfo('λ μ€ν λ μμ± μ€λ₯', message, name, stack));
      return {
        ok: false,
        error: 'λ μ€ν λ μμ± μ€λ₯',
      };
    }
  }

  async editRestaurant(owner: User, editRestaurantInput: EditRestaurantInput) {
    const { restaurantId, categoryName, coverImg } = editRestaurantInput;
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          id: restaurantId,
        },
      });

      if (!restaurant) {
        //! π’ error λ μ€ν λ κ²μ μ€λ₯
        this.loggerService.logger().error(this.loggerService.loggerInfo('λ μ€ν λ κ²μ μ€λ₯'));
        return {
          ok: false,
          error: 'λ μ€ν λμ μ°Ύμμ μμ΅λλ€',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        //! π’ error λ μ€ν λ κΆν μ€λ₯
        this.loggerService.logger().error(this.loggerService.loggerInfo('λ μ€ν λ κΆν μ€λ₯'));
        return {
          ok: false,
          error: 'ν΄λΉ λ μ€ν λμ μ£ΌμΈμ΄ μλλλ€',
        };
      }

      let category: Category = null;
      if (categoryName || coverImg) {
        category = await this.categories.getOrCreateCategory(categoryName, coverImg);
      }

      await this.restaurants.save([
        {
          id: restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      // * π success
      this.loggerService.logger().info(this.loggerService.loggerInfo('λ μ€ν λ μμ  μλ£'));
      return {
        ok: true,
      };
    } catch (error) {
      //! π’ error μμμΉ λͺ»ν μλ¬ λ°μμ
      this.loggerService.logger().error(this.loggerService.loggerInfo('λ μ€ν λ νΈμ§ μ€λ₯'));
      return {
        ok: false,
        error: 'λ μ€ν λ νΈμ§ μ€λ₯',
      };
    }
  }
}
