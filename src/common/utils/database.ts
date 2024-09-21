import type { KyselifyEntity } from 'kysely-typeorm';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Verification } from '../../users/entities/verification.entity';
import { Category } from '../../restaurants/entities/category.entity';

//               ^? { id: Generated<number>, firstName: string | null, ... }
export type UserTable = KyselifyEntity<User>;
export type RestaurantTable = KyselifyEntity<Restaurant>;
export type VerificationTable = KyselifyEntity<Verification>;
export type CategoryTable = KyselifyEntity<Category>;

export interface Database {
  user: UserTable;
  verification: VerificationTable;
  restaurant: RestaurantTable;
}
