import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { PagedItemView } from "./presenter/PageItemPresenter";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import { User } from "tweeter-shared/dist/model/domain/User";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            // <StatusItemScroller
            //   key={`feed-${displayedUser!.alias}`}
            //   featurePath="/feed"
            //   presenterFactory={(view: PagedItemView<Status>) =>
            //     new FeedPresenter(view)
            //   }
            // />
            <ItemScroller
              key={`feed-${displayedUser!.alias}`}
              featurePath="/feed"
              presenterFactory={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentFactory={(item: Status) => (
                <StatusItem status={item} featurePath="/feed" />
              )}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            // <StatusItemScroller
            //   key={`story-${displayedUser!.alias}`}
            //   featurePath="/story"
            //   presenterFactory={(view: PagedItemView<Status>) =>
            //     new StoryPresenter(view)
            //   }
            // />
            <ItemScroller
              key={`story-${displayedUser!.alias}`}
              featurePath="/story"
              presenterFactory={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentFactory={(item: Status) => (
                <StatusItem status={item} featurePath="/story" />
              )}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            // <UserItemScroller
            //   key={`followees-${displayedUser!.alias}`}
            //   featurePath="/followees"
            //   presenterFactory={(view: PagedItemView<User>) =>
            //     new FolloweePresenter(view)
            //   }
            // />
            <ItemScroller
              key={`followees-${displayedUser!.alias}`}
              featurePath="/followees"
              presenterFactory={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentFactory={(item: User) => (
                <UserItem user={item} featurePath="/followees" />
              )}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            // <UserItemScroller
            //   key={`followers-${displayedUser!.alias}`}
            //   featurePath="/followers"
            //   presenterFactory={(view: PagedItemView<User>) =>
            //     new FollowerPresenter(view)
            //   }
            // />
            <ItemScroller
              key={`followers-${displayedUser!.alias}`}
              featurePath="/followers"
              presenterFactory={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentFactory={(item: User) => (
                <UserItem user={item} featurePath="/followers" />
              )}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
