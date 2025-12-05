import { SQSEvent } from "aws-lambda";
import { Status } from "tweeter-shared";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const feedDAO = daoFactory.getFeedDAO();

interface FeedItemMessage {
  feedItems: Array<{
    userAlias: string;
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
  }>;
}

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      const message: FeedItemMessage = JSON.parse(record.body);

      const feedItems = message.feedItems.map((item) => {
        const status = Status.fromDto(item.status);
        if (!status) {
          throw new Error("Invalid status in feed item");
        }
        return {
          userAlias: item.userAlias,
          status: status,
        };
      });

      await feedDAO.batchPutFeedItems(feedItems);
    } catch (error) {
      console.error("Error processing feed update queue:", error);
      throw error;
    }
  }
};


