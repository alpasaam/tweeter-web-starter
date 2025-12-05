import { Select } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { FollowDAO } from "../FollowDAO";
import { UserDAO } from "../UserDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";

export class DynamoDBFollowDAO extends BaseDynamoDAO implements FollowDAO {
  private readonly indexName = "follow_index";
  private readonly userDAO: UserDAO;

  constructor(userDAO: UserDAO) {
    super("follow");
    this.userDAO = userDAO;
  }

  async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          follower_alias: followerAlias,
          followee_alias: followeeAlias,
        },
      })
    );
  }

  async deleteFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          follower_alias: followerAlias,
          followee_alias: followeeAlias,
        },
      })
    );
  }

  async getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null
  ): Promise<[User[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: "follower_alias = :follower_alias",
      ExpressionAttributeValues: {
        ":follower_alias": followerAlias,
      },
      Limit: pageSize,
    };

    if (lastFolloweeAlias !== null) {
      params.ExclusiveStartKey = {
        follower_alias: followerAlias,
        followee_alias: lastFolloweeAlias,
      };
    }

    const response = await this.client.send(new QueryCommand(params));

    if (!response.Items || response.Items.length === 0) {
      return [[], false];
    }

    const users: User[] = [];
    for (const item of response.Items) {
      const user = await this.userDAO.getUser(item.followee_alias);
      if (user) {
        users.push(user);
      }
    }

    const hasMore = response.LastEvaluatedKey !== undefined;

    return [users, hasMore];
  }

  async getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<[User[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "followee_alias = :followee_alias",
      ExpressionAttributeValues: {
        ":followee_alias": followeeAlias,
      },
      Limit: pageSize,
    };

    if (lastFollowerAlias !== null) {
      params.ExclusiveStartKey = {
        followee_alias: followeeAlias,
        follower_alias: lastFollowerAlias,
      };
    }

    const response = await this.client.send(new QueryCommand(params));

    if (!response.Items || response.Items.length === 0) {
      return [[], false];
    }

    const users: User[] = [];
    for (const item of response.Items) {
      const user = await this.userDAO.getUser(item.follower_alias);
      if (user) {
        users.push(user);
      }
    }

    const hasMore = response.LastEvaluatedKey !== undefined;

    return [users, hasMore];
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "follower_alias = :follower_alias",
      ExpressionAttributeValues: {
        ":follower_alias": followerAlias,
      },
      Select: Select.COUNT,
    };

    const response = await this.client.send(new QueryCommand(params));

    return response.Count ?? 0;
  }

  async getFollowerAliases(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<[string[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "followee_alias = :followee_alias",
      ExpressionAttributeValues: {
        ":followee_alias": followeeAlias,
      },
      ProjectionExpression: "follower_alias",
      Limit: pageSize,
    };

    if (lastFollowerAlias !== null) {
      params.ExclusiveStartKey = {
        followee_alias: followeeAlias,
        follower_alias: lastFollowerAlias,
      };
    }

    const response = await this.client.send(new QueryCommand(params));

    if (!response.Items || response.Items.length === 0) {
      return [[], false];
    }

    const aliases = response.Items.map((item) => item.follower_alias);
    const hasMore = response.LastEvaluatedKey !== undefined;

    return [aliases, hasMore];
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "followee_alias = :followee_alias",
      ExpressionAttributeValues: {
        ":followee_alias": followeeAlias,
      },
      Select: Select.COUNT,
    };

    const response = await this.client.send(new QueryCommand(params));

    return response.Count ?? 0;
  }

  async isFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        follower_alias: followerAlias,
        followee_alias: followeeAlias,
      },
    };

    const response = await this.client.send(new GetCommand(params));

    return response.Item !== undefined;
  }
}
