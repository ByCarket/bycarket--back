export interface JwtSign {
  sub: string;
  email: string;
}

export interface JwtPayload extends JwtSign {
  exp: Date;
  iat: Date;
}
