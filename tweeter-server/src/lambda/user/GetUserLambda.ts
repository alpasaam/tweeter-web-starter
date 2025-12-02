import type { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthorizationService } from "../../model/service/AuthorizationService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const authorizationService = new AuthorizationService(daoFactory);
const userService = new UserService(daoFactory);

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  try {
    await authorizationService.authorize(request.token);
    const user = await userService.getUser(request.token, request.alias);

    return {
      success: true,
      message: null,
      user,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "unauthorized") {
      throw error;
    }
    return {
      success: false,
      message: errorMessage,
      user: null,
    };
  }
};
