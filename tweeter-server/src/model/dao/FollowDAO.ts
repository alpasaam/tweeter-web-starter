import { User } from "tweeter-shared";

export interface FollowDAO {
  putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null
  ): Promise<[User[], boolean]>;
  getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<[User[], boolean]>;
  getFolloweeCount(followerAlias: string): Promise<number>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
}

