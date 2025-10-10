import { useNavigate } from "react-router-dom";

import { useMessageActions } from "./toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import {
  UserHookPresenter,
  UserHookView,
} from "../presenter/UserHookPresenter";
import { useRef } from "react";

export const useUserNavigation = (featurePath: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const navigate = useNavigate();

  const listener: UserHookView = {
    displayErrorMessage,
    navigate,
    setDisplayedUser,
  };

  const presenterRef = useRef<UserHookPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserHookPresenter(listener);
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    await presenterRef.current?.navigateToUser(
      event,
      featurePath,
      authToken!,
      displayedUser!
    );
  };

  return { navigateToUser };
};
