import "isomorphic-fetch";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, User, Status } from "tweeter-shared";
import { ServerFacade } from "../../src/net/ServerFacade";

describe("StatusService Integration Tests", () => {
  let statusService: StatusService;
  let authToken: AuthToken;
  let testUser: User;
  let serverFacade: ServerFacade;

  beforeAll(async () => {
    statusService = new StatusService();
    serverFacade = new ServerFacade();

    // Register a test user to get an auth token
    const [user, token] = await serverFacade.register({
      firstName: "Status",
      lastName: "Test",
      alias: `@statustest${Date.now()}`,
      password: "testpassword123",
      imageStringBase64: "",
      imageFileExtension: "png",
    });

    testUser = user;
    authToken = token;
  });

  describe("loadMoreStoryItems", () => {
    it("should successfully retrieve story items and return array of Statuses and hasMore boolean", async () => {
      const [statuses, hasMore] = await statusService.loadMoreStoryItems(
        authToken,
        testUser.alias,
        10,
        null
      );

      expect(Array.isArray(statuses)).toBe(true);
      expect(typeof hasMore).toBe("boolean");

      // Verify statuses are valid Status objects
      if (statuses.length > 0) {
        const firstStatus = statuses[0];
        expect(firstStatus).toBeInstanceOf(Status);
        expect(firstStatus.post).toBeTruthy();
        expect(firstStatus.user).toBeInstanceOf(User);
        expect(firstStatus.user.firstName).toBeTruthy();
        expect(firstStatus.user.lastName).toBeTruthy();
        expect(firstStatus.user.alias).toBeTruthy();
        expect(typeof firstStatus.timestamp).toBe("number");
      }
    });
  });
});
