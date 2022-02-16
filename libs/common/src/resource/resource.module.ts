import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Resource from './entities/Resource';
import { ConfigModule } from '@app/common/config';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), ConfigModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
