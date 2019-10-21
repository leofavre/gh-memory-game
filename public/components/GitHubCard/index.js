import { GitHubCardFactory } from './GitHubCardFactory.js';
import { GitHubCardView } from './GitHubCardView.js';
import { WithComponent } from '../common/WithComponent.js';

const GitHubCard = GitHubCardFactory(WithComponent(HTMLElement));
GitHubCard.view = GitHubCardView;

export { GitHubCard };
