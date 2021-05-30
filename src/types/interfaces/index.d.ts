import { TokenType, UserType } from '$types/enums';

export interface IPayload {
  id: number;
  userType: UserType;
  tokenType?: TokenType;
}

export interface IToken {
  token: string;
  refreshToken: string;
}
