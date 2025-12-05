import { SQSEvent } from "aws-lambda";
import {
  SQSClient,
  SendMessageBatchCommand,
  GetQueueUrlCommand,
} from "@aws-sdk/client-sqs";
import { Status } from "tweeter-shared";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const sqsClient = new SQSClient({ region: "us-west-2" });
const daoFactory = new DynamoDBDAOFactory();
const followDAO = daoFactory.getFollowDAO();

async function getFeedUpdateQueueUrl(): Promise<string> {
  const queueName = process.env.FEED_UPDATE_QUEUE_NAME;
  if (!queueName) {
    throw new Error("FEED_UPDATE_QUEUE_NAME environment variable not set");
  }
  const response = await sqsClient.send(
    new GetQueueUrlCommand({ QueueName: queueName })
  );
  if (!response.QueueUrl) {
    throw new Error(`Queue ${queueName} not found`);
  }
  return response.QueueUrl;
}

interface PostStatusMessage {
  status: {
    post: string;
    timestamp: number;
    user: {
      alias: string;
      firstName: string;
      lastName: string;
      imageUrl: string;
    };
  };
}

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      const message: PostStatusMessage = JSON.parse(record.body);
      const status = Status.fromDto(message.status);

      if (!status) {
        console.error("Invalid status in message");
        continue;
      }

      const followerAliases: string[] = [];
      let lastFollowerAlias: string | null = null;
      let hasMore = true;

      while (hasMore) {
        const [aliases, more] = await followDAO.getFollowerAliases(
          status.user.alias,
          1000,
          lastFollowerAlias
        );
        followerAliases.push(...aliases);
        hasMore = more;
        if (aliases.length > 0) {
          lastFollowerAlias = aliases[aliases.length - 1];
        }
      }

      const feedUpdateQueueUrl = await getFeedUpdateQueueUrl();
      const feedItemsPerMessage = 25;
      const sqsBatchSize = 10;

      const feedItemBatches: Array<Array<{ userAlias: string; status: any }>> =
        [];
      for (let i = 0; i < followerAliases.length; i += feedItemsPerMessage) {
        const batch = followerAliases.slice(i, i + feedItemsPerMessage);
        const feedItems = batch.map((alias) => ({
          userAlias: alias,
          status: message.status,
        }));
        feedItemBatches.push(feedItems);
      }

      for (let i = 0; i < feedItemBatches.length; i += sqsBatchSize) {
        const sqsBatch = feedItemBatches.slice(i, i + sqsBatchSize);
        const entries = sqsBatch.map((feedItems, index) => ({
          Id: `batch-${i + index}`,
          MessageBody: JSON.stringify({ feedItems }),
        }));

        await sqsClient.send(
          new SendMessageBatchCommand({
            QueueUrl: feedUpdateQueueUrl,
            Entries: entries,
          })
        );
      }
    } catch (error) {
      console.error("Error processing post status queue:", error);
      throw error;
    }
  }
};
