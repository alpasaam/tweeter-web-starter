import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { useMessageActions } from "../../../src/components/toaster/MessageHooks";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

jest.mock("../../../src/components/toaster/MessageHooks", () => ({
  ...jest.requireActual("../../../src/components/toaster/MessageHooks"),
  __esModule: true,
  useMessageActions: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockDisplayInfoMessage = jest.fn();
  const mockDisplayErrorMessage = jest.fn();
  const mockDeleteMessage = jest.fn();

  const mockUser = new User("First", "Last", "@alias", "imageUrl");
  const mockAuthToken = new AuthToken("token", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockAuthToken,
    });

    (useMessageActions as jest.Mock).mockReturnValue({
      displayInfoMessage: mockDisplayInfoMessage,
      displayErrorMessage: mockDisplayErrorMessage,
      deleteMessage: mockDeleteMessage,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDisplayInfoMessage.mockReturnValue("messageId123");
  });

  it("starts with the post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables the post status and clear buttons when the text field has text", async () => {
    const { postStatusButton, clearButton, postTextArea, user } =
      renderPostStatusAndGetElements();

    await user.type(postTextArea, "Hello");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables the post status and clear buttons when the text field is cleared", async () => {
    const { postStatusButton, clearButton, postTextArea, user } =
      renderPostStatusAndGetElements();

    await user.type(postTextArea, "Hello");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postTextArea);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's submitPost method with correct parameters when the post status button is pressed", async () => {
    const submitPostSpy = jest
      .spyOn(PostStatusPresenter.prototype, "submitPost")
      .mockResolvedValue(undefined);

    const { postStatusButton, postTextArea, user } =
      renderPostStatusAndGetElements();

    const postText = "This is my status";

    await user.type(postTextArea, postText);
    await user.click(postStatusButton);

    expect(submitPostSpy).toHaveBeenCalledWith(
      mockAuthToken,
      mockUser,
      postText
    );

    submitPostSpy.mockRestore();
  });
});

function renderPostStatus() {
  return render(
    <MemoryRouter>
      <PostStatus />
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElements() {
  const user = userEvent.setup();

  renderPostStatus();

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postTextArea = screen.getByRole("textbox");

  return { user, postStatusButton, clearButton, postTextArea };
}
