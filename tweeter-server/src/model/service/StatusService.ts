import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";

export class StatusService implements Service {
  private daoFactory: DAOFactory;

  constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
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
    const feedDAO = this.daoFactory.getFeedDAO();
    const followDAO = this.daoFactory.getFollowDAO();

    const status = Status.fromDto(newStatus);
    if (!status) {
      throw new Error("Invalid status");
    }

    await statusDAO.putStatus(status);

    const [followers] = await followDAO.getFollowers(status.user.alias, 10000, null);
    const feedItems = followers.map((follower) => ({
      userAlias: follower.alias,
      status: status,
    }));

    if (feedItems.length > 0) {
      await feedDAO.batchPutFeedItems(feedItems);
    }
  }
}
