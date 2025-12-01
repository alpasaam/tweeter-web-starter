import { BatchWriteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";
import { FeedDAO } from "../FeedDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";
import { StatusPaginationHelper } from "./StatusPaginationHelper";

export class DynamoDBFeedDAO extends BaseDynamoDAO implements FeedDAO {
  private readonly batchSize = 25;

  constructor() {
    super("feed");
  }

  async putFeedItem(userAlias: string, status: Status): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          user_alias: userAlias,
          timestamp: status.timestamp,
          post: status.post,
          author_alias: status.user.alias,
          author_firstName: status.user.firstName,
          author_lastName: status.user.lastName,
          author_imageUrl: status.user.imageUrl,
        },
      })
    );
  }

  async getFeedItems(
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
      "author"
    );
  }

  async batchPutFeedItems(
    items: Array<{ userAlias: string; status: Status }>
  ): Promise<void> {
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);

      const writeRequests = batch.map((item) => ({
        PutRequest: {
          Item: {
            user_alias: item.userAlias,
            timestamp: item.status.timestamp,
            post: item.status.post,
            author_alias: item.status.user.alias,
            author_firstName: item.status.user.firstName,
            author_lastName: item.status.user.lastName,
            author_imageUrl: item.status.user.imageUrl,
          },
        },
      }));

      await this.client.send(
        new BatchWriteCommand({
          RequestItems: {
            [this.tableName]: writeRequests,
          },
        })
      );
    }
  }
}
