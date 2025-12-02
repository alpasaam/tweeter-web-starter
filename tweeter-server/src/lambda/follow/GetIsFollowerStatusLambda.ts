import type { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const followService = new FollowService(daoFactory);

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  await authorizationService.authorize(request.token);
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower,
  };
};
