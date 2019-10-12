const MemoryGameView = document.createElement('template');

MemoryGameView.innerHTML = `
  <style>
    :host {
      display: block;
      perspective: 1800px;
    }

    ::slotted(*) {
      margin: 0;
    }

    div {
      display: grid;
      grid-gap: var(--memory-game-gap, 1em); 
    }
  </style>
  <div>
    <slot></slot>
  </div>
`;

export { MemoryGameView };
