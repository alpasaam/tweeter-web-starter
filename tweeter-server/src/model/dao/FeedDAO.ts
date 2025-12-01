import { Status } from "tweeter-shared";

export interface FeedDAO {
  putFeedItem(userAlias: string, status: Status): Promise<void>;
  getFeedItems(
    userAlias: string,
    pageSize: number,
    lastStatusTimestamp: number | null
  ): Promise<[Status[], boolean]>;
  batchPutFeedItems(
    items: Array<{ userAlias: string; status: Status }>
  ): Promise<void>;
}

