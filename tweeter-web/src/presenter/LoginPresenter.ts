import { User } from "tweeter-shared/dist/model/domain/User";
import { UserService } from "../model.service/UserService";
import { AuthView, Presenter } from "./Presenter";
import { AuthToken } from "tweeter-shared";
import { AuthItemPresenter } from "./AuthItemPresenter";
export class LoginPresenter extends AuthItemPresenter<AuthView> {
  protected doAuthenticatedOperation(
    userAlias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.service.login(userAlias, password);
  }

  protected notifyAndNavigate(
    originalUrl: string | undefined,
    user: User
  ): void {
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate(`/feed/${user.alias}`);
    }
  }

  protected itemDescription(): string {
    return "log user in";
  }
}
