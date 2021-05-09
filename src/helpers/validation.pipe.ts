import { ErrorCode } from '$types/enums';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Exception } from './exception';
import { validate } from './validate';

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = parseInt(value, 10);

    if (isNaN(value)) {
      throw new Exception(ErrorCode.Invalid_Input, 'You have provided invalid params.');
    }

    return value;
  }
}

@Injectable()
export class Validate implements PipeTransform {
  private schemaRef: AjvSchema;

  constructor(schemaRef: AjvSchema) {
    this.schemaRef = schemaRef;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    validate(this.schemaRef, value);
    return value;
  }
}
