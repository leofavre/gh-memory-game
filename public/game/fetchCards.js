import {
  getSelfInformation,
  getUserInformation,
  getRelatedUsersInPullRequests,
  getRelatedUsersInNotifications,
  getUserFollowing,
  getUserFollowers,
  rankUsersByCount
} from '../service/gitHubService.js';

export const fetchCards = async (max = 12, login) => {
  const cards = [];

  const addUsersToCards = users => {
    users.forEach(user => {
      if (!cards.find(item => item.login === user.login)) {
        cards.push(user);
      }
    });
  };

  const subject = login
    ? await getUserInformation(login)
    : await getSelfInformation();
  addUsersToCards([subject]);

  const relatedInPRs = await getRelatedUsersInPullRequests(subject.login);
  const rankedUsersInPRs = rankUsersByCount(relatedInPRs);
  addUsersToCards(rankedUsersInPRs);

  if (cards.length >= max) {
    return cards.slice(0, max);
  }

  const relatedInNotes = await getRelatedUsersInNotifications(subject.login);
  const rankedUsersInNotes = rankUsersByCount(relatedInNotes);
  addUsersToCards(rankedUsersInNotes);

  if (cards.length >= max) {
    return cards.slice(0, max);
  }

  for (const user of cards.slice(1)) {
    const relatedUsers = await getRelatedUsersInPullRequests(user.login);
    const rankedUsers = rankUsersByCount(relatedUsers);
    addUsersToCards(rankedUsers);

    if (cards.length >= max) {
      return cards.slice(0, max);
    }
  }

  const following = await getUserFollowing(subject.login);
  const rankedFollowing = rankUsersByCount(following);
  addUsersToCards(rankedFollowing);

  if (cards.length >= max) {
    return cards.slice(0, max);
  }

  const followers = await getUserFollowers(subject.login);
  const rankedFollowers = rankUsersByCount(followers);
  addUsersToCards(rankedFollowers);

  return cards.slice(0, max);
};
