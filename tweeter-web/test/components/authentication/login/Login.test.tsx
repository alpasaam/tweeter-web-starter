import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button if both alias and passwords fields have text", async () => {
    const { signInButton, aliasField, passwordInput, user } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "a");
    await user.type(passwordInput, "b");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either the alias or the password field is cleared", async () => {
    const { signInButton, aliasField, passwordInput, user } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "a");
    await user.type(passwordInput, "b");

    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordInput);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "https://somewhere.com";
    const alias = "@alias";
    const password = "myPassword";

    const {
      signInButton,
      aliasField,
      passwordInput: passwordField,
      user,
    } = renderLoginAndGetElement(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doAuthenticate(alias, password, originalUrl)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordInput = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordInput };
}
