import { unique } from '../helpers/unique.js';

export const applyGameRules = board => {
  let timer;

  Object.defineProperties(board, {
    matched: {
      get () {
        return board._matched || [];
      },
      set (value) {
        board._matched = unique(value);
      }
    },
    selected: {
      get () {
        return board.revealed
          .filter(idx => !board.matched.includes(idx));
      }
    },
    gotNewMatch: {
      get () {
        return board.cards
          .filter((card, idx) => board.selected.includes(idx))
          .map(card => card.login)
          .every((login, idx, arr) => login === arr[0]);
      }
    }
  });

  board.addEventListener('try', async ({ detail }) => {
    const { index } = detail;

    if (board.matched.includes(index)) {
      console.log('already matched');
      return undefined;
    }

    clearTimeout(timer);

    board.revealed = (board.selected.length === 2)
      ? [...board.matched, index]
      : [...board.revealed, index];

    if (board.selected.length === 2) {
      if (board.gotNewMatch) {
        board.matched = [...board.matched, ...board.selected];
      } else {
        timer = setTimeout(() => {
          board.revealed = [...board.matched];
        }, 4000);
      }
    }

    if (board.matched.length === board.cards.length) {
      console.log('game over');
      return undefined;
    }
  });
};
