import 'express';

declare module 'express' {
  interface Request {
    rawBody?: Buffer;
  }
}
