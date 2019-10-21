const GithubCardView = document.createElement('template');

GithubCardView.innerHTML = `
  <style>
    :host {
      height: auto;
      margin: 0;
      padding: 0;
      background: transparent;
    }

    :host([revealed]) .surface {
      transform: rotateY(180deg);
    }

    .wrapper {
      position: relative;
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: calc(1 / (var(--github-card-proportion, 1/1)) * 100%);
      perspective: var(--github-card-perspective, 1200px);
    }

    .surface {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform var(--github-card-speed, 0.32s) ease-in-out;
    }

    .side {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      overflow: hidden;
      border-radius: var(--github-card-border-radius, 0px);
      border: var(--github-card-border, none);
    }

    .side_back {
      display: flex;
      width: 100%;
      height: 100%;
      background: var(--github-card-background, grey);
    }

    .side_front {
      transform: rotateY(-180deg);
    }
  </style>
  <div class="wrapper">
    <div class="surface">
      <div class="side side_front">
        <slot></slot>
      </div>
      <div class="side side_back"></div>
    </div>
  </div>
`;

export { GithubCardView };
