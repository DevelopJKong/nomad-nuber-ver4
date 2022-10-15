import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { MailModuleOptions } from './mail.interface';
import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {}

  //* email config 속성 설정
  config(): object {
    const {
      service,
      host,
      port,
      secure,
      auth: { user, pass },
    } = this.options;

    const data = {
      service,
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    };

    return data;
  }
  mailVar(email: string, username: string, codeNum: string) {
    const {
      auth: { user },
    } = this.options;

    const data = {
      from: `${user}`,
      to: email,
      subject: `${username}님 Nuber Eats 에 오신것을 환영합니다!`,
      html: `
      <strong>Nuber Eats</strong>
      <br/>
      <hr/>
      <p style="font-size:25px">아래에 있는 확인 코드를 입력해주세요☕</p>
      <p style="color:#0984e3; font-size: 25px;">${codeNum}</p>
      <br/>
      <p> 더 열심히 하는 Nuber Eats가 되겠습니다</p>
      <p>&copy; ${new Date().getFullYear()} Nuber Eats</p>
      `,
    };
    return data;
  }

  async sendMail(data: Mail.Options) {
    const transporter = nodemailer.createTransport(this.config());
    transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        return info.response;
      }
    });
  }
}
