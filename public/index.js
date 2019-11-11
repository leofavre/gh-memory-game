import { STORE_INDEX } from './constants/index.js';
import { GitHubCard } from './components/GitHubCard/index.js';
import { MemoryGame } from './components/MemoryGame/index.js';
import { fetchCards } from './game/fetchCards.js';
import { applyGameRules } from './game/applyGameRules.js';
import { shuffle } from './helpers/shuffle.js';

(async () => {
  let token = window.localStorage.getItem(STORE_INDEX);
  const [, code] = window.location.href.match(/\?code=(.*)/) || [];

  if (token == null) {
    if (code != null) {
      const authUrl = `/authenticate/${code}`;
      ({ token } = await window.fetch(authUrl).then(res => res.json()));

      if (token != null) {
        window.localStorage.setItem(STORE_INDEX, token);
        window.location.href = '/';
      }
    } else {
      window.location.href = '/auth';
    }
    return undefined;
  }

  window.customElements.define('github-card', GitHubCard);
  window.customElements.define('memory-game', MemoryGame);

  const boardEl = document.createElement('memory-game');
  boardEl.rows = 4;
  boardEl.columns = 8;

  document.getElementById('play').appendChild(boardEl);
  applyGameRules(boardEl);

  const cards = await fetchCards(16);

  shuffle([...cards, ...cards])
    .forEach(({ login, avatar }) => {
      const cardEl = document.createElement('github-card');
      cardEl.login = login;
      cardEl.innerHTML = `
        <span>
          <img src="${avatar}"></img>
        </span>
      `;
      boardEl.appendChild(cardEl);
    });
})();
