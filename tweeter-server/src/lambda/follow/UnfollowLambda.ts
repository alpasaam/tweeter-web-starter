import type { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const followService = new FollowService(daoFactory);

export const handler = async (
  request: FollowRequest
): Promise<FollowResponse> => {
  try {
    await authorizationService.authorize(request.token);
  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.userToFollowOrUnfollow
  );

  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "unauthorized") {
      throw error;
    }
    return {
      success: false,
      message: errorMessage,
      followerCount: 0,
      followeeCount: 0,
    };
  }
};
