import { loadGameState, saveGameState } from './storage.js';
import { initialGameState } from './initialState.js';
import { processResourceUpdates, advanceTimeEvents } from './timeProcessor.js';

// Time tracking variables
let lastUpdateTime = Date.now();
const UPDATE_INTERVAL = 60000; // 1 minute

// Initialize the game
export function initializeGame() {
  // Check if we have a saved game state
  const savedState = loadGameState();
  
  // If no saved state, initialize with default state
  if (!savedState) {
    saveGameState(initialGameState);
  }
  
  // Set up periodic updates
  setupPeriodicUpdates();
  
  // Register service worker for offline support
  registerServiceWorker();
  
  console.log('Game initialized successfully');
}

// Set up periodic updates for resource generation and time-based events
function setupPeriodicUpdates() {
  // Process updates initially
  processUpdates();
  
  // Check for updates when tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      processUpdates();
    }
  });
  
  // Process updates periodically
  setInterval(processUpdates, UPDATE_INTERVAL);
}

// Process all time-based updates
function processUpdates() {
  const currentTime = Date.now();
  const elapsedMinutes = (currentTime - lastUpdateTime) / 60000;
  
  if (elapsedMinutes < 0.1) return; // Less than 6 seconds, skip update
  
  // Load current state
  const gameState = loadGameState();
  if (!gameState) return;
  
  // Calculate resource updates based on time elapsed
  const updatedState = processResourceUpdates(gameState, elapsedMinutes);
  
  // Process time-based events
  const finalState = advanceTimeEvents(updatedState, elapsedMinutes);
  
  // Save updated state
  saveGameState(finalState);
  
  // Update last update time
  lastUpdateTime = currentTime;
}

// Register service worker for offline support
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }
}

