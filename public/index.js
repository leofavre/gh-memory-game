import { STORE_INDEX } from './constants/index.js';
import { GitHubCard } from './components/GitHubCard/index.js';
import { MemoryGame } from './components/MemoryGame/index.js';
import { fetchCards } from './game/fetchCards.js';
import { applyGameRules } from './game/applyGameRules.js';
import { shuffle } from './helpers/shuffle.js';

const actOnRoute = async (route) => {
  switch (route) {
    case '/oauth': {
      let token;
      const [, code] = window.location.href.match(/\?code=(.*)/) || [];

      if (code != null) {
        try {
          ({ token } = await window
            .fetch(`/request-token?code=${code}`)
            .then(res => res.json()));
        } catch (err) {}

        if (token != null) {
          window.localStorage.setItem(STORE_INDEX, token);
          window.location.href = '/';
        } else {
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
      break;
    }

    case '/play': {
      window.customElements.define('github-card', GitHubCard);
      window.customElements.define('memory-game', MemoryGame);

      const boardEl = document.createElement('memory-game');
      boardEl.rows = 4;
      boardEl.columns = 8;

      document.getElementById('play').appendChild(boardEl);
      applyGameRules(boardEl);

      let cards;

      try {
        cards = await fetchCards(16);
      } catch (err) {}

      if (!cards) {
        window.localStorage.removeItem(STORE_INDEX);
        window.location.href = '/login';
        return undefined;
      }

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
      break;
    }
  }
};

actOnRoute(window.location.pathname);
