import { UserType } from '$types/enums';

export interface IPayload {
  id: number;
  type: UserType;
}

export interface IToken {
  token: string;
  refreshToken: string;
}
