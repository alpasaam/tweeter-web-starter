import { User, UserDto, AuthToken, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
const bcrypt = require("bcryptjs");

export class UserService implements Service {
  private daoFactory: DAOFactory;

  constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    const userDAO = this.daoFactory.getUserDAO();
    const user = await userDAO.getUser(alias);
    return user ? user.dto : null;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const passwordHash = await userDAO.getPasswordHash(alias);
    if (!passwordHash) {
      throw new Error("Invalid alias or password");
    }

    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid alias or password");
    }

    const user = await userDAO.getUser(alias);
    if (!user) {
      throw new Error("Invalid alias or password");
    }

    const authToken = AuthToken.Generate();
    await authTokenDAO.putAuthToken(
      authToken.token,
      user.alias,
      authToken.timestamp
    );

    return [user.dto, authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    const s3DAO = this.daoFactory.getS3DAO();

    const existingUser = await userDAO.getUser(alias);
    if (existingUser !== null) {
      throw new Error("Alias already taken");
    }

    const imageUrl = await s3DAO.uploadImage(
      imageStringBase64,
      imageFileExtension,
      alias
    );

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User(firstName, lastName, alias, imageUrl);
    await userDAO.putUser(user, passwordHash);

    const authToken = AuthToken.Generate();
    await authTokenDAO.putAuthToken(
      authToken.token,
      user.alias,
      authToken.timestamp
    );

    return [user.dto, authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    await authTokenDAO.deleteAuthToken(token);
  }
}
