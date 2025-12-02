import type {
  PagedItemRequest,
  PagedItemResponse,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const followService = new FollowService(daoFactory);

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
  await authorizationService.authorize(request.token);
  const [items, hasMore] = await followService.loadMoreFollowers(
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
};
