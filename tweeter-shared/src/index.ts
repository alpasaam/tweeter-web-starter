// Domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";

// Request base classes
export { type TweeterRequest } from "./model/net/request/TweeterRequest";
export { type AuthenticatedRequest } from "./model/net/request/AuthenticatedRequest";
export { type AuthenticationCredentials } from "./model/net/request/AuthenticationCredentials";

// Request classes
export { type PagedItemRequest } from "./model/net/request/PagedItemRequest";
export { type GetCountRequest } from "./model/net/request/GetCountRequest";
export { type IsFollowerRequest } from "./model/net/request/IsFollowerRequest";
export { type FollowRequest } from "./model/net/request/FollowRequest";
export { type PostStatusRequest } from "./model/net/request/PostStatusRequest";
export { type GetUserRequest } from "./model/net/request/GetUserRequest";
export { type LoginRequest } from "./model/net/request/LoginRequest";
export { type RegisterRequest } from "./model/net/request/RegisterRequest";
export { type LogoutRequest } from "./model/net/request/LogoutRequest";

// Response classes
export { type TweeterResponse } from "./model/net/response/TweeterResponse";
export { type PagedItemResponse } from "./model/net/response/PagedItemResponse";
export { type GetCountResponse } from "./model/net/response/GetCountResponse";
export { type IsFollowerResponse } from "./model/net/response/IsFollowerResponse";
export { type FollowResponse } from "./model/net/response/FollowResponse";
export { type GetUserResponse } from "./model/net/response/GetUserResponse";
export { type LoginResponse } from "./model/net/response/LoginResponse";

// DTO classes
export { type UserDto } from "./model/dto/UserDto";
export { type StatusDto } from "./model/dto/StatusDto";
export { type AuthTokenDto } from "./model/dto/AuthTokenDto";
