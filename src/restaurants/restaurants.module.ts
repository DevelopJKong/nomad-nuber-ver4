import { CategoryRepository } from './repositories/categories.repository';
import { Category } from './entities/category.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsResolver } from './restaurants.resolver';
import { provideCustomRepository } from 'src/common/custom-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantsService, RestaurantsResolver, provideCustomRepository(Category, CategoryRepository)],
  exports: [RestaurantsResolver],
})
export class RestaurantsModule {}
