import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Status, User } from "tweeter-shared";
import { BaseDynamoDAO } from "./BaseDynamoDAO";

export class StatusPaginationHelper {
  static async getPaginatedStatuses(
    dao: BaseDynamoDAO,
    partitionKeyName: string,
    partitionKeyValue: string,
    pageSize: number,
    lastTimestamp: number | null,
    userFieldPrefix: string
  ): Promise<[Status[], boolean]> {
    const tableName = dao.tableName;
    const client = (dao as any).client;

    const params: any = {
      TableName: tableName,
      KeyConditionExpression: `${partitionKeyName} = :${partitionKeyName}`,
      ExpressionAttributeValues: {
        [`:${partitionKeyName}`]: partitionKeyValue,
      },
      ScanIndexForward: false,
      Limit: pageSize,
    };

    if (lastTimestamp !== null) {
      params.ExclusiveStartKey = {
        [partitionKeyName]: partitionKeyValue,
        timestamp: lastTimestamp,
      };
    }

    const response = await client.send(new QueryCommand(params));

    if (!response.Items || response.Items.length === 0) {
      return [[], false];
    }

    const statuses: Status[] = [];
    for (const item of response.Items) {
      const status = new Status(
        item.post,
        new User(
          item[`${userFieldPrefix}_firstName`],
          item[`${userFieldPrefix}_lastName`],
          item[`${userFieldPrefix}_alias`],
          item[`${userFieldPrefix}_imageUrl`]
        ),
        item.timestamp
      );
      statuses.push(status);
    }

    const hasMore = response.LastEvaluatedKey !== undefined;

    return [statuses, hasMore];
  }
}
