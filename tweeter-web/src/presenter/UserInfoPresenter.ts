import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (followCount: number) => void;
  setFollowerCount: (followCount: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService = new FollowService();

  private async executeFollowChange(
    displayedUser: User,
    authToken: AuthToken,
    toastVerb: string,
    actionLabel: string,
    isFollowerAfter: boolean,
    operation: (auth: AuthToken, user: User) => Promise<[number, number]>
  ) {
    var toast: string | null = null;
    try {
      await this.doFailureReportingOperation(async () => {
        toast = this.view.displayInfoMessage(
          `${toastVerb} ${displayedUser.name}...`,
          0
        );
        const [followerCount, followeeCount] = await operation(
          authToken,
          displayedUser
        );
        this.view.setIsFollower(isFollowerAfter);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, actionLabel);
    } finally {
      this.view.deleteMessage(toast!);
    }
  }

  public followDisplayedUser(displayedUser: User, authToken: AuthToken) {
    return this.executeFollowChange(
      displayedUser,
      authToken,
      "Following",
      "follow user",
      true,
      this.service.follow.bind(this.service)
    );
  }

  public unfollowDisplayedUser(displayedUser: User, authToken: AuthToken) {
    return this.executeFollowChange(
      displayedUser,
      authToken,
      "Unfollowing",
      "unfollow user",
      false,
      this.service.unfollow.bind(this.service)
    );
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }
}
