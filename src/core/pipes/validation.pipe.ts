import { ErrorCode } from '$types/enums';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Exception, UnprocessableEntity } from '../../helpers/exception';
import { validate } from '../../helpers/validate';

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isNumeric = ['string', 'number'].includes(typeof value) && !isNaN(parseFloat(value)) && isFinite(value);

    if (!isNumeric) {
      throw new UnprocessableEntity('Validation failed (numeric string is expected)');
    }

    return parseInt(value, 10);
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
