import { Exception } from '$helpers/exception';
import { validate } from '$helpers/validate';
import { ErrorCode, Permissions } from '$types/enums';
import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { RequirePermissions } from '../authorization/permissions.decorator';
import { updateConfigSchema } from './config.schema';
import { ConfigService } from './config.service';

@Controller('cms/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}
  @Get('/')
  @RequirePermissions(Permissions.CONFIG_MANAGEMENT)
  async getList(@Query() query) {
    return await this.configService.getListConfig(query);
  }

  @Get('/:key')
  @RequirePermissions(Permissions.CONFIG_MANAGEMENT)
  async getDetailConfig(@Query('key') key: string) {
    if (!key) throw new Exception(ErrorCode.Invalid_Input, 'Missing config key.');
    return await this.configService.getDetailConfig(key);
  }

  @Put('/:key')
  @RequirePermissions(Permissions.CONFIG_MANAGEMENT)
  async updateConfig(@Body() body, @Query('key') key: string) {
    validate(updateConfigSchema, body);
    if (!key) throw ErrorCode.Invalid_Input;
    await this.configService.updateConfig(key, body);
    return;
  }
}
