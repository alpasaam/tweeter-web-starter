import { UserDAO } from "./UserDAO";
import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { StatusDAO } from "./StatusDAO";
import { FeedDAO } from "./FeedDAO";
import { S3DAO } from "./S3DAO";

export interface DAOFactory {
  getUserDAO(): UserDAO;
  getAuthTokenDAO(): AuthTokenDAO;
  getFollowDAO(): FollowDAO;
  getStatusDAO(): StatusDAO;
  getFeedDAO(): FeedDAO;
  getS3DAO(): S3DAO;
}
