export type JwtPayload = {
  sub: string;
  email: string;
  exp: Date;
  iat: Date;
};
