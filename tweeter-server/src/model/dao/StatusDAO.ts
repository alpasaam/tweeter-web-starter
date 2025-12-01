import { Status } from "tweeter-shared";

export interface StatusDAO {
  putStatus(status: Status): Promise<void>;
  getStatuses(
    userAlias: string,
    pageSize: number,
    lastStatusTimestamp: number | null
  ): Promise<[Status[], boolean]>;
}

