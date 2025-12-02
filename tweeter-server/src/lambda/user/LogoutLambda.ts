import type { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const userService = new UserService(daoFactory);

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  await authorizationService.authorize(request.token);
  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
