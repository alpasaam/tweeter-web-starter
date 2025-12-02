import {
  User,
  AuthToken,
  UserDto,
  StatusDto,
  Status,
  PagedItemRequest,
  PagedItemResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  LogoutRequest,
  GetCountRequest,
  GetCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  FollowRequest,
  FollowResponse,
  PostStatusRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://edntoifwo2.execute-api.us-west-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // User endpoints

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/getUser");

    if (response.success) {
      return User.fromDto(response.user);
    } else {
      throw new Error(response.message ?? "Failed to get user");
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/user/login");

    if (response.success && response.user && response.authToken) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);
      if (user && authToken) {
        return [user, authToken];
      }
      throw new Error("Invalid response from server");
    } else {
      throw new Error(response.message ?? "Login failed");
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      LoginResponse
    >(request, "/user/register");

    if (response.success && response.user && response.authToken) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);
      if (user && authToken) {
        return [user, authToken];
      }
      throw new Error("Invalid response from server");
    } else {
      throw new Error(response.message ?? "Registration failed");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      import("tweeter-shared").TweeterResponse
    >(request, "/user/logout");

    if (!response.success) {
      throw new Error(response.message ?? "Logout failed");
    }
  }

  // Follow endpoints

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/follow/getFollowees");

    if (response.success) {
      if (response.items == null) {
        throw new Error("No followees found");
      }
      const users = response.items
        .map((dto) => User.fromDto(dto))
        .filter((user): user is User => user !== null);
      return [users, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to get followees");
    }
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/follow/getFollowers");

    if (response.success) {
      if (response.items == null) {
        throw new Error("No followers found");
      }
      const users = response.items
        .map((dto) => User.fromDto(dto))
        .filter((user): user is User => user !== null);
      return [users, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to get followers");
    }
  }

  public async getFolloweeCount(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(request, "/follow/getFolloweeCount");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Failed to get followee count");
    }
  }

  public async getFollowerCount(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(request, "/follow/getFollowerCount");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Failed to get follower count");
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/getIsFollowerStatus");

    if (response.success) {
      return response.isFollower;
    } else {
      throw new Error(response.message ?? "Failed to get follower status");
    }
  }

  public async follow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(response.message ?? "Failed to follow user");
    }
  }

  public async unfollow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(response.message ?? "Failed to unfollow user");
    }
  }

  // Status endpoints

  public async loadMoreFeedItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/status/loadMoreFeedItems");

    if (response.success) {
      if (response.items == null) {
        throw new Error("No feed items found");
      }
      const statuses = response.items
        .map((dto) => Status.fromDto(dto))
        .filter((status): status is Status => status !== null);
      return [statuses, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to load feed items");
    }
  }

  public async loadMoreStoryItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/status/loadMoreStoryItems");

    if (response.success) {
      if (response.items == null) {
        throw new Error("No story items found");
      }
      const statuses = response.items
        .map((dto) => Status.fromDto(dto))
        .filter((status): status is Status => status !== null);
      return [statuses, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to load story items");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      import("tweeter-shared").TweeterResponse
    >(request, "/status/postStatus");

    if (!response.success) {
      throw new Error(response.message ?? "Failed to post status");
    }
  }
}
