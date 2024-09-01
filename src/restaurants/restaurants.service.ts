import { EditRestaurantInput } from './dto/edit-restaurant.dto';
import { LoggerService } from 'src/logger/logger.service';
import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantInput } from './dto/create-restaurant.dto';
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

      // * 👍 success
      this.loggerService.logger().info(this.loggerService.loggerInfo('레스토랑 생성 완료'));
      return {
        ok: true,
      };
    } catch (error) {
      //! 📢 error 예상치 못한 에러 발생
      const { message, name, stack } = error;
      this.loggerService
        .logger()
        .error(this.loggerService.loggerInfo('레스토랑 생성 오류', message, name, stack));
      return {
        ok: false,
        error: '레스토랑 생성 오류',
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
        //! 📢 error 레스토랑 검색 오류
        this.loggerService.logger().error(this.loggerService.loggerInfo('레스토랑 검색 오류'));
        return {
          ok: false,
          error: '레스토랑을 찾을수 없습니다',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        //! 📢 error 레스토랑 권한 오류
        this.loggerService.logger().error(this.loggerService.loggerInfo('레스토랑 권한 오류'));
        return {
          ok: false,
          error: '해당 레스토랑의 주인이 아닙니다',
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
      // * 👍 success
      this.loggerService.logger().info(this.loggerService.loggerInfo('레스토랑 수정 완료'));
      return {
        ok: true,
      };
    } catch (error) {
      //! 📢 error 예상치 못한 에러 발생시
      this.loggerService.logger().error(this.loggerService.loggerInfo('레스토랑 편집 오류'));
      return {
        ok: false,
        error: '레스토랑 편집 오류',
      };
    }
  }
}
