import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";

export class DynamoDBAuthTokenDAO
  extends BaseDynamoDAO
  implements AuthTokenDAO
{
  constructor() {
    super("authToken");
  }

  async putAuthToken(
    token: string,
    userAlias: string,
    timestamp: number
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: { token, userAlias, timestamp },
      })
    );
  }

  async getAuthToken(
    token: string
  ): Promise<{ userAlias: string; timestamp: number } | null> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );

    if (!response.Item) {
      return null;
    }

    return {
      userAlias: response.Item.userAlias,
      timestamp: response.Item.timestamp,
    };
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );
  }
}
