import { NextFunction, Request, Response } from 'express';

export function LoggerGlobal(req: Request, res: Response, next: NextFunction) {
  const currentTime = new Date().toISOString();
  console.log(
    `Estas ejecuntando un metodo ${req.method} en la ruta ${req.url}, ${currentTime}`,
  );
  next();
}
