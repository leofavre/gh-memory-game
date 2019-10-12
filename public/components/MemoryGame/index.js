import { MemoryGameFactory } from './MemoryGameFactory.js';
import { MemoryGameView } from './MemoryGameView.js';
import { WithComponent } from '../common/WithComponent.js';

const MemoryGame = MemoryGameFactory(WithComponent(HTMLElement));
MemoryGame.view = MemoryGameView;

export { MemoryGame };
