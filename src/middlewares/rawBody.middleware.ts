import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class StripeRawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.json({
      verify: (req: any, res, buf: Buffer) => {
        req.rawBody = buf;
      },
    })(req, res, next);
  }
}
