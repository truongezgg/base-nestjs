import Ajv from 'ajv';
import { Exception, Unauthorized } from './exception';
import addFormats from 'ajv-formats';
import { ErrorCode } from '$types/enums';
import { HttpStatus } from '@nestjs/common';

// Ex: 2021-06-19T00:00:00.000Z
const ISOStringRegex = new RegExp(
  '^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9].[0-9][0-9][0-9])Z$',
);

const AjvInstance = new Ajv();
addFormats(AjvInstance);
AjvInstance.addFormat('ISOString', {
  validate: (dateTimeString: string) => ISOStringRegex.test(dateTimeString),
});

export function validate(schemaKeyRef: AjvSchema | any, data: any) {
  const validate = AjvInstance.validate(schemaKeyRef, data);
  if (!validate) throw new Exception(ErrorCode.Invalid_Input, AjvInstance.errors, HttpStatus.UNPROCESSABLE_ENTITY);
}
