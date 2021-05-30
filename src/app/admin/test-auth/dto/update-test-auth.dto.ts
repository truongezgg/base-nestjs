import { PartialType } from '@nestjs/mapped-types';
import { CreateTestAuthDto } from './create-test-auth.dto';

export class UpdateTestAuthDto extends PartialType(CreateTestAuthDto) {}
