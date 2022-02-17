import { Public } from '$core/decorators/public.decorator';
import { CustomParseIntPipe } from '$core/pipes/validation.pipe';
import { handleInputPaging } from '$helpers/utils';
import { validate } from '$helpers/validate';
import { Permissions, ResourceType } from '$types/enums';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequirePermissions } from '../authorization/permissions.decorator';
import {
  addResourceSchema,
  updateResourceSchema,
  updateStatusResourceSchema,
  createResourceSingleSchema,
} from './resource.schema';
import { ResourceService } from './resource.service';

@Controller('cms/resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('/')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  async getLisResource(@Query() query) {
    handleInputPaging(query);
    return await this.resourceService.getListResource(query);
  }

  @Post('/')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  async createResource(@Body() body, @Param('userId', CustomParseIntPipe) userId: number) {
    validate(addResourceSchema, body);
    await this.resourceService.createResource(userId, body);
    return;
  }

  @Get('/:resourceId')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  async getDetailResource(@Param('resourceId', CustomParseIntPipe) resourceId: number) {
    return await this.resourceService.getDetailResource(resourceId);
  }

  @Put('/:resourceId')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  async updateResource(@Body() body, @Param('resourceId', CustomParseIntPipe) resourceId: number) {
    validate(updateResourceSchema, body);
    await this.resourceService.updateResource(resourceId, body);
    return;
  }

  @Put('/update-status/:resourceId')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  async updateStatusResource(@Body() body, @Param('resourceId', CustomParseIntPipe) resourceId: number) {
    validate(updateStatusResourceSchema, body);
    await this.resourceService.updateStatusResource(resourceId, body);
    return;
  }

  @Post('/create-resource-single')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  async createResourceSingle(@Body() body) {
    validate(createResourceSingleSchema, body);
    await this.resourceService.createResourceSingle(body);
    return;
  }

  @Public()
  @Get('/resource-by-type/:type')
  async getResourceByType(@Param('type', CustomParseIntPipe) type: ResourceType) {
    return await this.resourceService.getResourceByType(type);
  }
}
