import { App } from './components/App.js';
import { initializeGame } from './game/gameEngine.js';

// Initialize the game
initializeGame();

// Render the React application
ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);

