import type { RegisterRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();
const userService = new UserService(daoFactory);

export const handler = async (
  request: RegisterRequest
): Promise<LoginResponse> => {
  try {
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
