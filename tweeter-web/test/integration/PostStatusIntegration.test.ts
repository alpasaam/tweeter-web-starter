import "isomorphic-fetch";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { UserService } from "../../src/model.service/UserService";
import { StatusService } from "../../src/model.service/StatusService";
import { ServerFacade } from "../../src/net/ServerFacade";
import { AuthToken, User, Status } from "tweeter-shared";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";

describe("PostStatus Integration Test", () => {
  let userService: UserService;
  let statusService: StatusService;
  let serverFacade: ServerFacade;
  let testUser: User;
  let authToken: AuthToken;
  let testAlias: string;
  const testPassword = "testpassword123";

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

  jest.setTimeout(30000);

  beforeAll(async () => {
    userService = new UserService();
    statusService = new StatusService();
    serverFacade = new ServerFacade();

    testAlias = `@integrationtest${Date.now()}`;

    await serverFacade.register({
      firstName: "Integration",
      lastName: "Test",
      alias: testAlias,
      password: testPassword,
      imageStringBase64: "",
      imageFileExtension: "png",
    });
  });

  it("should post status and verify it appears in user's story", async () => {
    const [user, token] = await userService.login(testAlias, testPassword);
    testUser = user;
    authToken = token;

    expect(testUser).not.toBeNull();
    expect(authToken).not.toBeNull();
    expect(testUser.alias).toBe(testAlias);
    expect(authToken.token).toBeTruthy();

    const mockView = mock<PostStatusView>();
    const messageId = "messageId123";
    when(mockView.displayInfoMessage("Posting status...", 0)).thenReturn(
      messageId
    );

    const presenter = new PostStatusPresenter(instance(mockView));
    const statusText = `Test status message ${Date.now()}`;

    await presenter.submitPost(authToken, testUser, statusText);
    await flushPromises();

    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockView.displayErrorMessage(anything())).never();
    verify(mockView.setPost("")).once();
    verify(mockView.deleteMessage(messageId)).once();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      testUser.alias,
      10,
      null
    );

    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0].post).toBe(statusText);
    expect(statuses[0].user.alias).toBe(testUser.alias);
    expect(statuses[0].user.firstName).toBe(testUser.firstName);
    expect(statuses[0].user.lastName).toBe(testUser.lastName);
    expect(statuses[0].timestamp).toBeGreaterThan(Date.now() - 10000);
  });
});
