import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  GetUserRequest,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      alias,
    };

    return await this.serverFacade.getUser(request);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias,
      password,
    };

    return await this.serverFacade.login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension,
    };

    return await this.serverFacade.register(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    };

    await this.serverFacade.logout(request);
  }
}
