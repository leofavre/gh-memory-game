import { gitHubSdk } from './gitHubSdk.js';

export const getSelfInformation = gitHubSdk.self.get;

export const getRelatedUsersInPullRequests = login => {
  return gitHubSdk.userEvents
    .get(login)
    .then(events => {
      return events.reduce((result, event) => {
        const pullRequest = (event.payload && event.payload.pull_request) || {};

        const {
          assignees = [],
          requested_reviewers: requestedReviewers = []
        } = pullRequest;

        return [...result, ...assignees, ...requestedReviewers];
      }, []);
    })
    .catch(() => {
      throw new Error(`Unable to find related users of ${login}`);
    });
};

export const rankUsersByCount = (users = []) => {
  return users.reduce((result, user, index, arr) => {
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
