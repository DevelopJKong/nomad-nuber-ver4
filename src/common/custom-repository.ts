import { Provider, Type } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';

export function provideCustomRepository<T>(
  entity: Type<T>,
  repository: Type<Repository<T>>,
  //TODO DataSource 와 DataSourceOptions가 없는데 이럴때는 어떻게 해야하지?
  dataSource?: DataSource | DataSourceOptions | string,
): Provider {
  return {
    provide: getRepositoryToken(entity),
    inject: [getDataSourceToken(dataSource)],
    useFactory(dataSource: DataSource) {
      const baseRepository = dataSource.getRepository(entity);
      return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
    },
  };
}
