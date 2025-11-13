import { UserDto } from "../../dto/UserDto";

export interface GetCountRequest {
  readonly token: string;
  readonly user: UserDto;
}
