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

  public async followDisplayedUser(displayedUser: User, authToken: AuthToken) {
    var followingUserToast = null;
    try {
      this.doFailureReportingOperation(async () => {
        followingUserToast = this.view.displayInfoMessage(
          `Following ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await this.service.follow(
          authToken!,
          displayedUser!
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "follow user");
    } finally {
      this.view.deleteMessage(followingUserToast!);
    }
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    var unfollowingUserToast = null;
    try {
      this.doFailureReportingOperation(async () => {
        unfollowingUserToast = this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await this.service.unfollow(
          authToken!,
          displayedUser!
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "unfollow user");
    } finally {
      this.view.deleteMessage(unfollowingUserToast!);
    }
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
