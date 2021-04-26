import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CustomHttpException } from './exception';
import { validate } from './validate';

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = parseInt(value, 10);

    if (isNaN(value)) {
      throw new CustomHttpException({
        errorCode: 'Unknow_Error',
      });
    }

    return value;
  }
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  private schemaRef: AjvSchema;

  constructor(schemaRef: AjvSchema) {
    this.schemaRef = schemaRef;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    validate(this.schemaRef, value);
    return value;
  }
}
