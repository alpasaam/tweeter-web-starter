import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";
import { StatusPaginationHelper } from "./StatusPaginationHelper";

export class DynamoDBStatusDAO extends BaseDynamoDAO implements StatusDAO {
  constructor() {
    super("status");
  }

  async putStatus(status: Status): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          user_alias: status.user.alias,
          timestamp: status.timestamp,
          post: status.post,
          user_firstName: status.user.firstName,
          user_lastName: status.user.lastName,
          user_imageUrl: status.user.imageUrl,
        },
      })
    );
  }

  async getStatuses(
    userAlias: string,
    pageSize: number,
    lastStatusTimestamp: number | null
  ): Promise<[Status[], boolean]> {
    return StatusPaginationHelper.getPaginatedStatuses(
      this,
      "user_alias",
      userAlias,
      pageSize,
      lastStatusTimestamp,
      "user"
    );
  }
}
