import { FillFollowTableDao } from "./FillFollowTableDao";
import { FillUserTableDao } from "./FillUserTableDao";
import { User } from "tweeter-shared";

const mainUsername = "@daisy";
const baseFollowerAlias = "@donald";
const followerPassword = "password";
const followerImageUrl =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
const baseFollowerFirstName = "Donald";
const baseFollowerLastName = "Duck";
const numbUsersToCreate = 10000;
const numbFollowsToCreate = numbUsersToCreate;
const batchSize = 25;

const aliasList: string[] = Array.from(
  { length: numbUsersToCreate },
  (_, i) => baseFollowerAlias + (i + 1)
);

const fillUserTableDao = new FillUserTableDao();
const fillFollowTableDao = new FillFollowTableDao();

main();

async function main() {
  console.log("Creating users");
  await createUsers(0);
  console.log("Creating follows");
  await createFollows(0);
  console.log("Increasing the followee's followers count");
  await fillUserTableDao.increaseFollowersCount(
    mainUsername,
    numbUsersToCreate
  );
  console.log("Done!");
}

async function createUsers(createdUserCount: number) {
  const userList = createUserList(createdUserCount);
  await fillUserTableDao.createUsers(userList, followerPassword);
  createdUserCount += batchSize;

  if (createdUserCount % 1000 == 0) {
    console.log(`Created ${createdUserCount} users`);
  }

  if (createdUserCount < numbUsersToCreate) {
    await createUsers(createdUserCount);
  }
}

function createUserList(createdUserCount: number) {
  const users: User[] = [];
  const start = createdUserCount + 1;
  const limit = start + batchSize;

  for (let i = start; i < limit; ++i) {
    let user = new User(
      `${baseFollowerFirstName}_${i}`,
      `${baseFollowerLastName}_${i}`,
      `${baseFollowerAlias}${i}`,
      followerImageUrl
    );
    users.push(user);
  }

  return users;
}

async function createFollows(createdFollowsCount: number) {
  const followList = aliasList.slice(
    createdFollowsCount,
    createdFollowsCount + batchSize
  );
  await fillFollowTableDao.createFollows(mainUsername, followList);
  createdFollowsCount += batchSize;

  if (createdFollowsCount % 1000 == 0) {
    console.log(`Created ${createdFollowsCount} follows`);
  }

  if (createdFollowsCount < numbFollowsToCreate) {
    await createFollows(createdFollowsCount);
  }
}
