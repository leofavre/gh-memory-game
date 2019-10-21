import { githubSdk } from './githubSdk.js';

const removeInvalidOrBot = user =>
  user != null && !user.login.includes('[bot]');

const loginAndAvatar = ({ login, avatar_url: avatar }) => ({ login, avatar });

export const getSelfInformation = () =>
  githubSdk.self.get().then(loginAndAvatar);

export const getUserInformation = login =>
  githubSdk.user.get(login).then(loginAndAvatar);

export const getUserFollowers = login =>
  githubSdk.userFollowers.get(login).then(users => users
    .filter(removeInvalidOrBot).map(loginAndAvatar));

export const getUserFollowing = login =>
  githubSdk.userFollowing.get(login).then(users => users
    .filter(removeInvalidOrBot).map(loginAndAvatar));

export const getRelatedUsersInNotifications = login => {
  return githubSdk.userReceivedEvents.get(login)
    .then(events => events
      .reduce((result, event) => {
        return [
          'PullRequestEvent',
          'PullRequestReviewCommentEvent',
          'ReleaseEvent'
        ].includes(event.type)
          ? [...result, event.actor]
          : result;
      }, [])
      .filter(removeInvalidOrBot)
      .map(loginAndAvatar)
    );
};

export const getRelatedUsersInPullRequests = login => {
  return githubSdk.userEvents.get(login)
    .then(events => events
      .reduce((result, event) => {
        const pullRequest = (event.payload && event.payload.pull_request) || {};

        const {
          assignees = [],
          requested_reviewers: requestedReviewers = [],
          user,
          merged_by: mergedBy
        } = pullRequest;

        return [
          ...result,
          user,
          mergedBy,
          ...assignees,
          ...requestedReviewers
        ];
      }, [])
      .filter(removeInvalidOrBot)
      .map(loginAndAvatar)
    );
};

export const rankUsersByCount = (users = []) => {
  return users
    .reduce((result, user, index, arr) => {
      result = {
        ...result,
        [user.login]: {
          count: ((result[user.login] && result[user.login].count) || 0) + 1,
          user
        }
      };

      if (index === arr.length - 1) {
        return Object
          .values(result)
          .sort((a, b) => b.count - a.count)
          .map(obj => obj.user);
      }

      return result;
    }, []);
};
