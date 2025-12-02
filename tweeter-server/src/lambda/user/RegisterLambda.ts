import type { RegisterRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const userService = new UserService(daoFactory);

export const handler = async (
  request: RegisterRequest
): Promise<LoginResponse> => {
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.imageStringBase64,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user,
    authToken,
  };
};
