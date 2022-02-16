import { Exception } from '$helpers/exception';
import { ErrorCode } from '$types/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import Config from './entities/Config';

interface ISearchConfigParams {
  keyword?: string;
}

@Injectable()
export class ConfigService {
  constructor(@InjectRepository(Config) private configRepository: Repository<Config>) {}

  /**
   * Get list config data.
   */
  async getListConfig(params: ISearchConfigParams) {
    const configs = this.configRepository
      .createQueryBuilder('config')
      .select([
        'config.key',
        'config.name',
        'config.value',
        'config.type',
        'config.order',
        'config.isSystem',
        'config.createdAt',
        'config.createdBy',
      ]);

    if (params.keyword) {
      configs.where('config.name like :name', { name: `%${params.keyword}%` });
    }

    return await configs.getMany();
  }

  async updateConfig(key: string, params: { name: string; order: number }) {
    return await this.configRepository.update(key, params);
  }

  async getDetailConfig(key: string) {
    const config = await this.configRepository.findOne(key);
    if (!config) throw new Exception(ErrorCode.Not_Found, `Not found this config key: ${key}`);
    return config;
  }

  /**
   * In some cases, such as Resources and Languages
   * Configuration must be incremented every time the time table has any change.
   * 1. Create new config key if not exist.
   * 2. Increment config value.
   */
  async updateVersionConfig(transaction: EntityManager, key: string) {
    await transaction.query(
      `INSERT INTO config (\`key\`, \`name\`, \`value\`, \`is_system\`, \`created_by\`, \`order\`)
      SELECT \`temp\`.* FROM (SELECT ? as \`key\`, ? as \`name\`, 0 as \`value\`, 1 as \`is_system\`, 1 as \`created_by\`, 0 as \`order\`) as temp 
      WHERE NOT EXISTS ( SELECT \`key\` FROM \`config\` WHERE \`key\` = ?) LIMIT 1`,
      [key, key, key],
    );

    await transaction.query('UPDATE config SET `value` = IFNULL(`value`, 0) + 1  WHERE `key` = ?', [key]);
  }
}
