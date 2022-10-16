import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { JwtService } from './../jwt/jwt.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger/logger.service';
import { Repository } from 'typeorm';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
    private readonly loggerService: LoggerService,
    private readonly jwtService: JwtService,
    private readonly emailService: MailService,
  ) {}

  async findById({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });

      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: '유저를 찾지 못했습니다',
      };
    }
  }

  async createAccount({ email, password, role }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({
        where: {
          email,
        },
      });

      if (exists) {
        //! 📢 error 존재하는 계정으로 사용자가 만들려고 했을 경우
        this.loggerService.logger().error(this.loggerService.loggerInfo('사용자 계정 만들기 성공'));
        return {
          ok: false,
          error: '이미 존재하는 계정입니다',
        };
      }

      //TODO 향후 이메일 검증이 있을때 작성 예정
      const user = await this.users.save(
        this.users.create({
          email,
          password,
          role,
        }),
      );

      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );

      await this.emailService.sendMail(this.emailService.mailVar(user.email, user.email, verification.code));

      //* 👍 success
      this.loggerService.logger().info(this.loggerService.loggerInfo('사용자 계정 만들기 성공'));
      return {
        ok: true,
      };
    } catch (error) {
      //! 📢 error 예상치 못한 에러 발생
      this.loggerService
        .logger()
        .error(this.loggerService.loggerInfo('계정을 생성할수 없습니다', error.message, error.name, error.stack));
      return {
        ok: false,
        error: '계정을 생성할수 없습니다',
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: {
          email,
        },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user) {
        //! 📢 error 해당 계정이 존재하지 않을 경우
        this.loggerService.logger().error(this.loggerService.loggerInfo('해당 계정이 존재하지 않습니다'));
        return {
          ok: false,
          error: '해당 계정이 존재하지 않습니다',
        };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 잘못 되었습니다',
        };
      }

      const token = this.jwtService.sign({ id: user.id });

      //* 👍 success
      this.loggerService.logger().info(this.loggerService.loggerInfo('로그인 성공'));
      return {
        ok: true,
        token,
      };
    } catch (error) {
      //! 📢 error 예상치 못한 에러 발생
      this.loggerService
        .logger()
        .error(this.loggerService.loggerInfo('로그인을 할수없습니다', error.message, error.name, error.stack));
      return {
        ok: false,
        error: '로그인을 할수없습니다',
      };
    }
  }

  async editProfile(userId: number, { email, password }: EditProfileInput): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (email) {
        user.email = email;
        user.verified = false;

        await this.verifications.delete({ user: { id: user.id } });
        const verification = await this.verifications.save(this.verifications.create({ user }));

        await this.emailService.sendMail(this.emailService.mailVar(user.email, user.email, verification.code));
      }

      if (password) {
        user.password = password;
      }

      await this.users.save(user);

      //* 👍 success
      this.loggerService.logger().info(this.loggerService.loggerInfo('계정 정보 수정 성공'));
      return {
        ok: true,
      };
    } catch (error) {
      //! 📢 error 예상치 못한 에러 발생
      this.loggerService
        .logger()
        .error(this.loggerService.loggerInfo('계정 정보를 수정 할수 없습니다', error.message, error.name, error.stack));
      return {
        ok: false,
        error: '계정 정보를 수정 할수 없습니다',
      };
    }
  }
}
