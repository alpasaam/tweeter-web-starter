import {
  AuthToken,
  User,
  UserDto,
  PagedItemRequest,
  GetCountRequest,
  IsFollowerRequest,
  FollowRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return await this.serverFacade.getMoreFollowees(request);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return await this.serverFacade.getMoreFollowers(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: GetCountRequest = {
      token: authToken.token,
      user: user.dto,
    };

    return await this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: GetCountRequest = {
      token: authToken.token,
      user: user.dto,
    };

    return await this.serverFacade.getFollowerCount(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: IsFollowerRequest = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };

    return await this.serverFacade.getIsFollowerStatus(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      userToFollowOrUnfollow: userToFollow.dto,
    };

    return await this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      userToFollowOrUnfollow: userToUnfollow.dto,
    };

    return await this.serverFacade.unfollow(request);
  }
}
