import type { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const userService = new UserService(daoFactory);

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  try {
  const [user, authToken] = await userService.login(
    request.alias,
    request.password
  );

  return {
    success: true,
    message: null,
    user,
    authToken,
  };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      message: errorMessage,
      user: null,
      authToken: null,
    };
  }
};
