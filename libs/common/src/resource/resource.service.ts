import { handleOutputPaging } from '$helpers/utils';
import { Exception } from '$helpers/exception';
import { CommonStatus, ErrorCode, ResourceType } from '$types/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Not, Repository } from 'typeorm';
import Resource from './entities/Resource';
import { ConfigService } from '@app/common/config';

const RESOURCE_VERSION = 'RESOURCE_VERSION';

@Injectable()
export class ResourceService {
  constructor(
    private configService: ConfigService,
    private connection: Connection,
    @InjectRepository(Resource) private resourceRepository: Repository<Resource>,
  ) {}

  async getListResource(params: IListResource) {
    const queryBuilder = this.resourceRepository
      .createQueryBuilder('resource')
      .select([
        'resource.id',
        'resource.name',
        'resource.status',
        'resource.order',
        'resource.type',
        'resource.createdBy',
      ])
      .take(params.take)
      .skip(params.skip)
      .where('1=1');

    if (params.type) {
      queryBuilder.andWhere('resource.type = :type', { type: params.type });
    }

    if (params.status) {
      queryBuilder.andWhere('resource.status = :status', { status: params.status });
    }

    if (params.keyword) {
      queryBuilder.andWhere('LOWER(resource.name) like :name', { name: `%${params.keyword.toLowerCase()}%` });
    }

    const [data, total] = await queryBuilder
      .orderBy('resource.order', 'ASC')
      .addOrderBy('resource.createdAt')
      .getManyAndCount();
    return handleOutputPaging(data, total, params);
  }

  async createResource(userId: number, params: IAddResource) {
    params.createdBy = userId;
    return await this.connection.transaction(async (transaction) => {
      // await clearCacheResourceRedis(transaction);
      await this.configService.updateVersionConfig(transaction, RESOURCE_VERSION);
      return await transaction.getRepository(Resource).save(params);
    });
  }

  async updateResource(resourceId: number, params: IUpdateResource) {
    await this.connection.transaction(async (transaction) => {
      const resourceRepository = transaction.getRepository(Resource);
      await resourceRepository.update(resourceId, { ...params });
      await this.configService.updateVersionConfig(transaction, RESOURCE_VERSION);
    });
    return;
  }

  async updateStatusResource(resourceId: number, params: IUpdateStatusResource) {
    return await this.connection.transaction(async (transaction) => {
      // await clearCacheResourceRedis(transaction);
      await this.configService.updateVersionConfig(transaction, RESOURCE_VERSION);
      return await this.resourceRepository.update(resourceId, { ...params });
    });
  }

  async getDetailResource(resourceId: number) {
    const resource = await this.resourceRepository.findOne(resourceId);
    if (!resource) throw new Exception(ErrorCode.Not_Found);
    return resource;
  }

  async createResourceSingle(params: ICreateResourceSingle) {
    const resource = await this.resourceRepository.findOne({
      type: params.type,
    });

    if (resource) throw new Exception(ErrorCode.Resource_Already_Exists, 'Resource already exist');

    await this.resourceRepository.save(params);
  }

  async getResourceByType(type: number) {
    const resource = await this.resourceRepository.find({
      where: {
        type: type,
        status: Not(CommonStatus.INACTIVE),
      },
    });
    return resource;
  }
}

export interface IListResource {
  take: number;
  pageIndex: number;
  start: number;
  skip: number;
  sort: any;
  keyword: string;
  status: number;
  type: ResourceType;
}

export interface IAddResource {
  name: string;
  type: ResourceType;
  createdBy: number;
}

export interface IUpdateResource {
  name: string;
}

export interface IUpdateStatusResource {
  status: number;
}

export interface ICreateResourceSingle {
  status: number;
  order: number;
  type: ResourceType;
  name: string;
  value: string;
  createdBy: number;
}
