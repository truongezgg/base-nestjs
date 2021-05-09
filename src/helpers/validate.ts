import AJV, { JSONSchemaType } from 'ajv';
import { ErrorCode } from '$types/enums';
import { Exception } from './exception';
import { HttpStatus } from '@nestjs/common';
import addFormats from 'ajv-formats';

const dateTimeRegex = new RegExp(
  '^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9].[0-9][0-9][0-9])Z$',
);

const Ajv = new AJV();
addFormats(Ajv);
Ajv.addFormat('ISOString', {
  validate: (dateTimeString: string) => dateTimeRegex.test(dateTimeString),
});

export function validate(schemaKeyRef: AjvSchema | any, data: any) {
  const validate = Ajv.validate(schemaKeyRef, data);

  if (!validate) {
    throw new Exception(ErrorCode.Invalid_Input, Ajv.errors, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
