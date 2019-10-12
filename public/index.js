import { STORE_INDEX } from './constants/index.js';
import { sdk } from './sdk/index.js';
import { GitHubCard } from './components/GitHubCard/index.js';
import { MemoryGame } from './components/MemoryGame/index.js';

const showOnScreen = str => {
  document.body.innerHTML += `<pre>${JSON.stringify(str, null, 2)}</pre>`;
};

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

  Promise
    .all([
      sdk.github.self.get(),
      sdk.github.followers.get(),
      sdk.github.following.get()
    ])
    .then(responses => {
      responses.forEach(showOnScreen);
    })
    .catch(() => {
      window.localStorage.removeItem(STORE_INDEX);
      window.location.href = '/';
    });

  window.customElements.define('github-card', GitHubCard);
  window.customElements.define('memory-game', MemoryGame);
})();
