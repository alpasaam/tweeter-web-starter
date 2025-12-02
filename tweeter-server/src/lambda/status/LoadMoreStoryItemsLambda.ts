import type {
  PagedItemRequest,
  PagedItemResponse,
  StatusDto,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const statusService = new StatusService(daoFactory);

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  try {
    await authorizationService.authorize(request.token);
    const [items, hasMore] = await statusService.loadMoreStoryItems(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    return {
      success: true,
      message: null,
      items: items,
      hasMore,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "unauthorized") {
      throw error;
    }
    return {
      success: false,
      message: errorMessage,
      items: [],
      hasMore: false,
    };
  }
};
