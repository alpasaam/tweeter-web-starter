import { DAOFactory } from "../dao/DAOFactory";

export class AuthorizationService {
  private daoFactory: DAOFactory;
  private readonly TOKEN_EXPIRATION_MINUTES = 60;

  constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
  }

  async authorize(token: string): Promise<string> {
    if (!token) {
      throw new Error("unauthorized");
    }

    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    const authToken = await authTokenDAO.getAuthToken(token);

    if (!authToken) {
      throw new Error("unauthorized");
    }

    const currentTime = Date.now();
    const tokenAge = currentTime - authToken.timestamp;
    const tokenAgeMinutes = tokenAge / (1000 * 60);

    if (tokenAgeMinutes > this.TOKEN_EXPIRATION_MINUTES) {
      await authTokenDAO.deleteAuthToken(token);
      throw new Error("unauthorized");
    }

    return authToken.userAlias;
  }
}
