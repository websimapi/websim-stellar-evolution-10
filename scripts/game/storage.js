// Constants
const GAME_STATE_KEY = 'stellar_evolution_state';

// Load game state from local storage
export function loadGameState() {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

// Save game state to local storage
export function saveGameState(state) {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Error saving game state:', error);
    return false;
  }
}

// Reset game state (delete saved game)
export function resetGameState() {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting game state:', error);
    return false;
  }
}

// Export game state to file
export function exportGameState() {
  try {
    const state = loadGameState();
    if (!state) {
      throw new Error('No game state to export');
    }
    
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `stellar_evolution_save_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting game state:', error);
    return false;
  }
}

// Import game state from file
export function importGameState(fileContent) {
  try {
    const state = JSON.parse(fileContent);
    saveGameState(state);
    return true;
  } catch (error) {
    console.error('Error importing game state:', error);
    return false;
  }
}

