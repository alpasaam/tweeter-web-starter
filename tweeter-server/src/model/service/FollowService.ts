import { User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";

export class FollowService implements Service {
  private daoFactory: DAOFactory;

  constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const lastFolloweeAlias = lastItem ? lastItem.alias : null;
    const [users, hasMore] = await followDAO.getFollowees(
      userAlias,
      pageSize,
      lastFolloweeAlias
    );
    const dtos = users.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const lastFollowerAlias = lastItem ? lastItem.alias : null;
    const [users, hasMore] = await followDAO.getFollowers(
      userAlias,
      pageSize,
      lastFollowerAlias
    );
    const dtos = users.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFollowerCount(user.alias);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.isFollower(user.alias, selectedUser.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const authToken = await authTokenDAO.getAuthToken(token);
    if (!authToken) {
      throw new Error("Invalid token");
    }

    const followerAlias = authToken.userAlias;
    await followDAO.putFollow(followerAlias, userToFollow.alias);

    const followerCount = await followDAO.getFollowerCount(userToFollow.alias);
    const followeeCount = await followDAO.getFolloweeCount(followerAlias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const authToken = await authTokenDAO.getAuthToken(token);
    if (!authToken) {
      throw new Error("Invalid token");
    }

    const followerAlias = authToken.userAlias;
    await followDAO.deleteFollow(followerAlias, userToUnfollow.alias);

    const followerCount = await followDAO.getFollowerCount(userToUnfollow.alias);
    const followeeCount = await followDAO.getFolloweeCount(followerAlias);

    return [followerCount, followeeCount];
  }
}
