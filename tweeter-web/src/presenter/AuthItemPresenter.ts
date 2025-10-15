import { AuthToken, User } from "tweeter-shared";
import { Presenter, AuthView } from "./Presenter";
import { UserService } from "../model.service/UserService";

export abstract class AuthItemPresenter<
  V extends AuthView
> extends Presenter<V> {
  private _service: UserService = new UserService();

  public constructor(view: V) {
    super(view);
    this._service = new UserService();
  }

  protected get service() {
    return this._service;
  }

  public async doAuthenticate(
    alias: string,
    password: string,
    originalUrl?: string | undefined,
    firstName?: string,
    lastName?: string,

    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<void> {
    try {
      this.view.setIsLoading(true);
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        const [user, authToken] = await this.doAuthenticatedOperation(
          alias,
          password,
          firstName,
          lastName,
          imageBytes,
          imageFileExtension
        );

        this.view.authenticate(user, authToken);

        this.notifyAndNavigate(originalUrl, user);
      }, this.itemDescription());
    } finally {
      this.view.setIsLoading(false);
    }
  }

  protected abstract doAuthenticatedOperation(
    userAlias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]>;

  protected abstract notifyAndNavigate(
    originalUrl: string | undefined,
    user: User
  ): void;

  protected abstract itemDescription(): string;
}
