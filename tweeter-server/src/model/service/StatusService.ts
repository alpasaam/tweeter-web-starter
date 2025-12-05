import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { SQSClient } from "@aws-sdk/client-sqs";

export class StatusService implements Service {
  private daoFactory: DAOFactory;
  private sqsClient: SQSClient;
  private postStatusQueueName: string;
  private region: string;
  private cachedQueueUrl: string | null = null;

  constructor(daoFactory: DAOFactory, postStatusQueueName?: string) {
    this.daoFactory = daoFactory;
    this.region = process.env.AWS_REGION || "us-west-2";
    this.sqsClient = new SQSClient({ region: this.region });
    this.postStatusQueueName =
      postStatusQueueName || process.env.POST_STATUS_QUEUE_NAME || "";
  }

  private async getQueueUrl(queueName: string): Promise<string> {
    if (this.cachedQueueUrl) {
      return this.cachedQueueUrl;
    }

    const { GetQueueUrlCommand } = await import("@aws-sdk/client-sqs");
    const response = await this.sqsClient.send(
      new GetQueueUrlCommand({ QueueName: queueName })
    );
    if (!response.QueueUrl) {
      throw new Error(`Queue ${queueName} not found`);
    }
    
    // Cache the URL for subsequent calls
    this.cachedQueueUrl = response.QueueUrl;
    return this.cachedQueueUrl;
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const feedDAO = this.daoFactory.getFeedDAO();
    const lastTimestamp = lastItem ? lastItem.timestamp : null;
    const [statuses, hasMore] = await feedDAO.getFeedItems(
      userAlias,
      pageSize,
      lastTimestamp
    );
    const dtos = statuses.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const statusDAO = this.daoFactory.getStatusDAO();
    const lastTimestamp = lastItem ? lastItem.timestamp : null;
    const [statuses, hasMore] = await statusDAO.getStatuses(
      userAlias,
      pageSize,
      lastTimestamp
    );
    const dtos = statuses.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const statusDAO = this.daoFactory.getStatusDAO();

    const status = Status.fromDto(newStatus);
    if (!status) {
      throw new Error("Unable to post status. Please try again.");
    }

    await statusDAO.putStatus(status);

    if (!this.postStatusQueueName) {
      throw new Error("POST_STATUS_QUEUE_NAME environment variable not set");
    }

    const queueUrl = await this.getQueueUrl(this.postStatusQueueName);
    const { SendMessageCommand } = await import("@aws-sdk/client-sqs");
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          status: newStatus,
        }),
      })
    );
  }
}
