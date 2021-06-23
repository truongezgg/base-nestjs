import { Public } from '$core/decorators/public.decorator';
import { handleInputPaging } from '$helpers/utils';
import { Permissions } from '$types/enums';
import { Body, Controller, Post, Put } from '@nestjs/common';
import { RequirePermissions } from '../authorization/permissions.decorator';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}
  @Public()
  @Post('/list')
  async getListLanguage(@Body() body) {
    const response = await this.languageService.getListLanguage(body);
    return response;
  }

  @Post('/add-language')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async addLanguage(@Body() body) {
    const response = await this.languageService.addLanguage(body);
    return response;
  }

  @Put('/update-language')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async updateLanguage(@Body() body) {
    const response = await this.languageService.updateLanguage(body);
    return response;
  }

  @Post('/list-language-key')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async getListLanguageKey(@Body() body) {
    handleInputPaging(body);
    const result = await this.languageService.getListLanguageKey(body);
    return result;
  }

  @Put('/add-language-key')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async addLanguageKey(@Body() body) {
    const result = await this.languageService.addLanguageKey(body);
    return result;
  }

  @Put('/update-language-key')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async updateLanguageKey(@Body() body) {
    const result = await this.languageService.updateLanguageKey(body);
    return result;
  }

  /**
   * Do not required permission in this API
   * @param req
   */
  @Public()
  @Post('/get-file-language')
  async getFileLanguage(@Body() body) {
    body.environment = body.environment || 'APP';
    const result = await this.languageService.getFileLanguage(body);
    return result;
  }

  @Post('/upload-file-language')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async uploadFileLanguage(@Body() body) {
    const result = await this.languageService.uploadLanguageFile(body);
    return result;
  }

  @Post('/list-environments')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async getListEnvironments() {
    const result = await this.languageService.getListEnvironments();
    return result;
  }
}
