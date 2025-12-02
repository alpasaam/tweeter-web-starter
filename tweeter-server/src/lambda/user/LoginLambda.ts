import type { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const userService = new UserService(daoFactory);

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
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
};
