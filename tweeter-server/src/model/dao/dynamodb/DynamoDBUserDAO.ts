import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";

export class DynamoDBUserDAO extends BaseDynamoDAO implements UserDAO {
  constructor() {
    super("user");
  }

  async getUser(alias: string): Promise<User | null> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      })
    );

    if (!response.Item) {
      return null;
    }

    return new User(
      response.Item.firstName,
      response.Item.lastName,
      response.Item.alias,
      response.Item.imageUrl
    );
  }

  async putUser(user: User, passwordHash: string): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          alias: user.alias,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          passwordHash,
        },
      })
    );
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
        ProjectionExpression: "passwordHash",
      })
    );

    return response.Item?.passwordHash ?? null;
  }
}
