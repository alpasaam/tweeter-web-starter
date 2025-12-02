import type { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const followService = new FollowService(daoFactory);

export const handler = async (
  request: GetCountRequest
): Promise<GetCountResponse> => {
  try {
    await authorizationService.authorize(request.token);
  const count = await followService.getFollowerCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count,
  };
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "unauthorized") {
      throw error;
    }
    return {
      success: false,
      message: errorMessage,
      count: 0,
    };
  }
};
