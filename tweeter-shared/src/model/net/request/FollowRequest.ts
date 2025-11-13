import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface FollowRequest extends AuthenticatedRequest {
  readonly userToFollowOrUnfollow: UserDto;
}
