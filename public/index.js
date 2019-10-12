import { STORE_INDEX } from './constants/index.js';
import { GitHubCard } from './components/GitHubCard/index.js';
import { MemoryGame } from './components/MemoryGame/index.js';

import {
  getSelfInformation,
  getRelatedUsersInPullRequests,
  rankUsersByCount
} from './service/gitHubService.js';

(async () => {
  let token = window.localStorage.getItem(STORE_INDEX);
  const [, code] = window.location.href.match(/\?code=(.*)/) || [];

  if (token == null) {
    if (code != null) {
      const authUrl = `http://localhost:3123/authenticate/${code}`;
      ({ token } = await window.fetch(authUrl).then(res => res.json()));

      if (token != null) {
        window.localStorage.setItem(STORE_INDEX, token);
        window.location.href = '/';
      }
    } else {
      document.body.innerHTML = '<a href="/login">Login with GitHub</a>';
    }
    return undefined;
  }

  const self = await getSelfInformation();
  console.log(self);

  const relatedUsers = await getRelatedUsersInPullRequests(self.login);
  const rankedUsers = rankUsersByCount(relatedUsers);
  console.log(rankedUsers);

  rankedUsers.forEach(async user => {
    const relatedUsers = await getRelatedUsersInPullRequests(user.login);
    const rankedUsers = rankUsersByCount(relatedUsers);
    console.log(rankedUsers);
  });

  window.customElements.define('github-card', GitHubCard);
  window.customElements.define('memory-game', MemoryGame);
})();
