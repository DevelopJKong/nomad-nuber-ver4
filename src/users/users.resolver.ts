import { VerifyEmailOutput, VerifyEmailInput } from './dtos/verify-email.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((_of: unknown) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((_returns) => UserProfileOutput)
  async findById(@Args() { userId }: UserProfileInput): Promise<UserProfileOutput> {
    return this.usersService.findById({ userId });
  }

  @Query((_returns) => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Mutation((_returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }
  @Mutation((_returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation((_returns) => EditProfileOutput)
  async editProfile(
    @Args('input') editProfileInput: EditProfileInput,
    @AuthUser() authUser: User,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((_returns) => VerifyEmailOutput)
  async verifyEmail(@Args('input') verifyEmailInput: VerifyEmailInput) {
    return this.usersService.verifyEmail(verifyEmailInput);
  }
}
