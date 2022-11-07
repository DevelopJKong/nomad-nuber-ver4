import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { LoggerModuleOptions } from './logger.interface';
import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
@Injectable()
export class LoggerService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: LoggerModuleOptions) {}

  logger(): winston.Logger {
    const { combine, timestamp, label, printf } = winston.format;
    //* 로그 파일 저장 경로 → 루트 경로/logs 폴더
    const logDir = `${process.cwd()}/logs`;

    //* log 출력 포맷 정의 함수
    const logFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
    });

    /*
     * Log Level
     * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
     */
    const logger: winston.Logger = winston.createLogger({
      //* 로그 출력 형식 정의
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        label({ label: 'NUBER-EATS' }), // 어플리케이션 이름
        logFormat, // log 출력 포맷
        //? format: combine() 에서 정의한 timestamp와 label 형식값이 logFormat에 들어가서 정의되게 된다. level이나 message는 콘솔에서 자동 정의
      ),

      //* 실제 로그를 어떻게 기록을 한 것인가 정의
      transports: [
        //* info 레벨 로그를 저장할 파일 설정 (info: 2 보다 높은 error: 0 와 warn: 1 로그들도 자동 포함해서 저장)
        new winstonDaily({
          level: 'info', // info 레벨
          datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
          dirname: logDir, // 파일 경로
          filename: `%DATE%.log`, // 파일 이름
          maxFiles: 30, // 최근 30일치 로그 파일을 남김
          zippedArchive: true,
        }),
        //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
        new winstonDaily({
          level: 'error', // error 레벨
          datePattern: 'YYYY-MM-DD',
          dirname: logDir + '/error', // /logs/error 하위에 저장
          filename: `%DATE%.error.log`, // 에러 로그는 2020-05-28.error.log 형식으로 저장
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
      //* uncaughtException 발생시 파일 설정
      exceptionHandlers: [
        new winstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: logDir,
          filename: `%DATE%.exception.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    if (this.options.nodeEnv !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // 색깔 넣어서 출력
            winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
          ),
        }),
      );
    }
    return logger;
  }
  /**
   * *로그 정보 string return 함수
   *
   *  ! custom 사용자 커스텀 메시지
   *  ! message 에러 메시지
   *  ! name  에러 이름
   *  ! stack  에러 스택
   *  ! return 최종 메시지
   */
  loggerInfo = (
    custom: string | null = '',
    message: string | null = '',
    name: string | null = '',
    stack: string | null = '',
  ): string => {
    try {
      throw Error(message);
    } catch (error) {
      try {
        const callerLine = error.stack.split('\n')[2];
        const apiNameArray = callerLine.split(' ');
        const apiName = apiNameArray.filter((item: string) => item !== null && item !== undefined && item !== '')[1];
        let LineNumber = callerLine.split('(')[1].split('/').slice(-1)[0].slice(0, -1);
        if (LineNumber.includes('C:')) {
          LineNumber = `${LineNumber.split('\\').slice(-1)[0]}`;
        }

        const lineNumberText = `Line Number: ${LineNumber} ::: ${apiName} | `;
        const errorMessage = `${error.message ? `Error Message: ${error.message} | ` : ''}`;
        const errorName = `${name ? `Error Name: ${name} | ` : ''}`;
        const errorStack = `${stack ? `Error Stack: ${stack.split('\n')[1].trim()} | ` : ''}`;
        const customMessage = `${custom ? `Custom Message : ${custom}` : ''}`;

        return `${lineNumberText}${errorMessage}${errorName}${errorStack}${customMessage}`;
      } catch (error) {
        const { message, stack, name } = error;
        return `Error Message ::: ${message} | Error Stack ::: ${stack} | Error Name ::: ${name}`;
      }
    }
  };
}
