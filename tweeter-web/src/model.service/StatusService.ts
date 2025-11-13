import {
  AuthToken,
  Status,
  StatusDto,
  PagedItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return await this.serverFacade.loadMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return await this.serverFacade.loadMoreStoryItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus.dto,
    };

    await this.serverFacade.postStatus(request);
  }
}
