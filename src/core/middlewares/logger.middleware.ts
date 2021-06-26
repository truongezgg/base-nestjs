import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getLogger } from 'log4js';

const logger = getLogger('Request');
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    logger.info(`[${req.method}]: ${req.originalUrl}`);
    next();
  }
}
