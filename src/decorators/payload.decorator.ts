import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Payload = createParamDecorator((property: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  const payload = request.payload;

  return property ? payload?.[property] : payload;
});
