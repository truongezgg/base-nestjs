import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestAuthService } from './test-auth.service';
import { CreateTestAuthDto } from './dto/create-test-auth.dto';
import { UpdateTestAuthDto } from './dto/update-test-auth.dto';

@Controller('test-auth')
export class TestAuthController {
  constructor(private readonly testAuthService: TestAuthService) {}

  @Post()
  create(@Body() createTestAuthDto: CreateTestAuthDto) {
    return this.testAuthService.create(createTestAuthDto);
  }

  @Get()
  findAll() {
    return this.testAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testAuthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestAuthDto: UpdateTestAuthDto) {
    return this.testAuthService.update(+id, updateTestAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testAuthService.remove(+id);
  }
}
