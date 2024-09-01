import { User } from './../entities/user.entity';
import { CoreOutput } from '../../common/dto/output.dto';
import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';

@InputType()
export class EditProfileInput extends PartialType(PickType(User, ['email', 'password'])) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
