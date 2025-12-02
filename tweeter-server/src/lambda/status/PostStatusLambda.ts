import type { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const statusService = new StatusService(daoFactory);

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  try {
    await authorizationService.authorize(request.token);
    await statusService.postStatus(request.token, request.newStatus);

    return {
      success: true,
      message: null,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "unauthorized") {
      throw error;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};
