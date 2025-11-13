import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface GetCountRequest extends AuthenticatedRequest {
  readonly user: UserDto;
}
