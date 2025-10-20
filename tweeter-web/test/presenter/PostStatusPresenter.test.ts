import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User("First", "Last", "@alias", "imageUrl");
  const statusText = "Hello, world!";

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    when(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).thenReturn("messageId123");

    const viewInstance = instance(mockPostStatusView);

    postStatusPresenter = new PostStatusPresenter(viewInstance);

    mockService = mock<StatusService>();
    when(mockService.postStatus(anything(), anything())).thenResolve();

    postStatusPresenter._service = instance(mockService);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, statusText);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, statusText);

    verify(mockService.postStatus(authToken, anything())).once();

    const [capturedAuthToken, capturedStatus] = capture(
      mockService.postStatus
    ).last();

    expect(capturedAuthToken).toBe(authToken);
    expect((capturedStatus as Status).post).toBe(statusText);
    expect((capturedStatus as Status).user).toBe(currentUser);
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when posting the status is successful", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, statusText);
    await flushPromises();

    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message, display an error message, and not clear the post or display a status posted message when posting the status is not successful", async () => {
    const error = new Error("An error occurred");
    when(mockService.postStatus(anything(), anything())).thenReject(error);

    await postStatusPresenter.submitPost(authToken, currentUser, statusText);
    await flushPromises();

    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post status  because of exception: An error occurred"
      )
    ).once();
    verify(mockPostStatusView.setPost(anything())).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
