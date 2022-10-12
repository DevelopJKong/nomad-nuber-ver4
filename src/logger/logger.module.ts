import { DynamicModule, Module, Global } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { LoggerModuleOptions } from './logger.interface';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
