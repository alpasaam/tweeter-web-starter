import "isomorphic-fetch";
import { ServerFacade } from "../../src/net/ServerFacade";
import {
  RegisterRequest,
  PagedItemRequest,
  UserDto,
  GetCountRequest,
  User,
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    serverFacade = new ServerFacade();

    // Register a test user to get an auth token for other tests
    const registerRequest: RegisterRequest = {
      firstName: "Test",
      lastName: "User",
      alias: `@testuser${Date.now()}`,
      password: "testpassword123",
      imageStringBase64: "",
      imageFileExtension: "png",
    };

    const [user, token] = await serverFacade.register(registerRequest);
    testUser = user;
    authToken = token.token;
  });

  describe("Register", () => {
    it("should successfully register a new user and return User and AuthToken", async () => {
      const registerRequest: RegisterRequest = {
        firstName: "Integration",
        lastName: "Test",
        alias: `@integrationtest${Date.now()}`,
        password: "testpassword123",
        imageStringBase64: "",
        imageFileExtension: "png",
      };

      const [user, token] = await serverFacade.register(registerRequest);

      expect(user).not.toBeNull();
      // Note: Server returns FakeData in Milestone 3, so we verify structure rather than exact values
      expect(user.firstName).toBeTruthy();
      expect(user.lastName).toBeTruthy();
      expect(user.alias).toBeTruthy();
      expect(user.imageUrl).toBeTruthy();
      expect(token).not.toBeNull();
      expect(token.token).toBeTruthy();
      expect(typeof token.timestamp).toBe("number");
    });
  });

  describe("GetFollowers", () => {
    it("should successfully get followers and return array of Users and hasMore boolean", async () => {
      const request: PagedItemRequest<UserDto> = {
        token: authToken,
        userAlias: testUser.alias,
        pageSize: 10,
        lastItem: null,
      };

      const [users, hasMore] = await serverFacade.getMoreFollowers(request);

      expect(Array.isArray(users)).toBe(true);
      expect(typeof hasMore).toBe("boolean");
      // Verify users are valid User objects
      if (users.length > 0) {
        const firstUser = users[0];
        expect(firstUser).toBeInstanceOf(User);
        expect(firstUser.firstName).toBeTruthy();
        expect(firstUser.lastName).toBeTruthy();
        expect(firstUser.alias).toBeTruthy();
      }
    });
  });

  describe("GetFolloweeCount", () => {
    it("should successfully get followee count and return a number >= 0", async () => {
      const request: GetCountRequest = {
        token: authToken,
        user: testUser.dto,
      };

      const count = await serverFacade.getFolloweeCount(request);

      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("GetFollowersCount", () => {
    it("should successfully get follower count and return a number >= 0", async () => {
      const request: GetCountRequest = {
        token: authToken,
        user: testUser.dto,
      };

      const count = await serverFacade.getFollowerCount(request);

      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
