import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export abstract class BaseDynamoDAO {
  protected readonly client: DynamoDBDocumentClient;
  public readonly tableName: string;

  constructor(tableName: string) {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: "us-west-2" })
    );
    this.tableName = tableName;
  }
}
