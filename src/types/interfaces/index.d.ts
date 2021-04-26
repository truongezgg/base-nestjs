import { AuthenticationType } from '$types/enums';

export interface IPayload {
  id: number;
  type: AuthenticationType;
}
