import { Exception } from '$helpers/exception';
import { ErrorCode } from '$types/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import Config from './entities/Config';

export enum ConfigKeys {
  RESOURCE_VERSION = 'RESOURCE_VERSION',
  LANGUAGE_VERSION = 'LANGUAGE_VERSION',
}

@Injectable()
export class ConfigService {
  constructor(@InjectRepository(Config) private configRepository: Repository<Config>) {}

  async getListConfig(params: any) {
    const configs = this.configRepository
      .createQueryBuilder('config')
      .select([
        'config.key',
        'config.name',
        'config.value',
        'config.type',
        'config.order',
        'config.metadata',
        'config.isSystem',
        'config.createdBy',
      ]);

    if (params.keyword) configs.where('config.name like :name', { name: `%${params.keyword}%` });

    return await configs.getMany();
  }

  async updateConfig(key: string, params: { name: string; order: number }) {
    // await this.connection.queryResultCache.remove([KeyCacheRedis.CONFIG]);
    return await this.configRepository.update(key, params);
  }

  async getDetailConfig(key: string) {
    const config = await this.configRepository.findOne(key);
    if (!config) throw new Exception(ErrorCode.Not_Found, `Not found this config key: ${key}`);
    return config;
  }

  // Insert key config if not exists.
  // Increment value of key.
  // Clear cache redis.
  async updateVersionConfig(transaction: EntityManager, configKeys: ConfigKeys) {
    await transaction.query(
      'INSERT INTO config (`key`, `name`, `value`, `is_system`, `created_by`, `order`) ' +
        'SELECT temp.* FROM ( ' +
        'SELECT ? as `key`, ? as `name`, 0 as `value`, 1 as is_system, 1 as created_by, 0 as `order`) as temp ' +
        'WHERE NOT EXISTS ( SELECT `key` FROM config WHERE `key` = ?) LIMIT 1',
      [configKeys, configKeys, configKeys],
    );
    await transaction.query('UPDATE config SET `value` = IFNULL(`value`, 0) + 1  WHERE `key` = ?', [configKeys]);
    // await transaction.connection.queryResultCache.remove([KeyCacheRedis.CONFIG]);
  }
}
