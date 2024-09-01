import { User } from './../entities/user.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput extends PickType(User, ['email', 'password', 'role']) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
