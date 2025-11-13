import { UserDto } from "../../dto/UserDto";

export interface IsFollowerRequest {
  readonly token: string;
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
