import { GithubCardFactory } from './GithubCardFactory.js';
import { GithubCardView } from './GithubCardView.js';
import { WithComponent } from '../common/WithComponent.js';

const GithubCard = GithubCardFactory(WithComponent(HTMLElement));
GithubCard.view = GithubCardView;

export { GithubCard };
