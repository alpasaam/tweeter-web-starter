import { DAOFactory } from "./DAOFactory";
import { UserDAO } from "./UserDAO";
import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { StatusDAO } from "./StatusDAO";
import { FeedDAO } from "./FeedDAO";
import { S3DAO } from "./S3DAO";
import { DynamoDBUserDAO } from "./dynamodb/DynamoDBUserDAO";
import { DynamoDBAuthTokenDAO } from "./dynamodb/DynamoDBAuthTokenDAO";
import { DynamoDBFollowDAO } from "./dynamodb/DynamoDBFollowDAO";
import { DynamoDBStatusDAO } from "./dynamodb/DynamoDBStatusDAO";
import { DynamoDBFeedDAO } from "./dynamodb/DynamoDBFeedDAO";
import { DynamoDBS3DAO } from "./dynamodb/DynamoDBS3DAO";

export class DynamoDBDAOFactory implements DAOFactory {
  private userDAO: UserDAO | null = null;
  private authTokenDAO: AuthTokenDAO | null = null;
  private followDAO: FollowDAO | null = null;
  private statusDAO: StatusDAO | null = null;
  private feedDAO: FeedDAO | null = null;
  private s3DAO: S3DAO | null = null;

  getUserDAO(): UserDAO {
    if (this.userDAO === null) {
      this.userDAO = new DynamoDBUserDAO();
    }
    return this.userDAO;
  }

  getAuthTokenDAO(): AuthTokenDAO {
    if (this.authTokenDAO === null) {
      this.authTokenDAO = new DynamoDBAuthTokenDAO();
    }
    return this.authTokenDAO;
  }

  getFollowDAO(): FollowDAO {
    if (this.followDAO === null) {
      this.followDAO = new DynamoDBFollowDAO(this.getUserDAO());
    }
    return this.followDAO;
  }

  getStatusDAO(): StatusDAO {
    if (this.statusDAO === null) {
      this.statusDAO = new DynamoDBStatusDAO();
    }
    return this.statusDAO;
  }

  getFeedDAO(): FeedDAO {
    if (this.feedDAO === null) {
      this.feedDAO = new DynamoDBFeedDAO();
    }
    return this.feedDAO;
  }

  getS3DAO(): S3DAO {
    if (this.s3DAO === null) {
      this.s3DAO = new DynamoDBS3DAO();
    }
    return this.s3DAO;
  }
}
