import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { useNavigate } from "react-router-dom";
export interface AuthItemView {
  displayErrorMessage: (message: string) => void;
  navigate: (path: string) => void;
  updateUserInfo: (
    user: any,
    authUser: any,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
}

export abstract class AuthItemPresenter {
  private _view: AuthItemView;
  private userService: UserService;

  private _rememberMe: boolean = false;
  private _isLoading: boolean = false;

  protected constructor(view: AuthItemView) {
    this._view = view;
    this.userService = new UserService();
  }

  protected get view() {
    return this._view;
  }

  public set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  public get rememberMe() {
    return this._rememberMe;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
  }
  public get isLoading() {
    return this._isLoading;
  }
}
