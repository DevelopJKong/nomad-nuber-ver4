import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsResolver } from './restaurants.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantsService, RestaurantsResolver],
  exports: [RestaurantsResolver],
})
export class RestaurantsModule {}
