import { MailModuleOptions } from './mail.interface';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { CONFIG_OPTIONS } from 'src/common/common.constant';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
