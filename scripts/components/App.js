import { Header } from './Header.js';
import { GameDisplay } from './GameDisplay.js';
import { CommandInput } from './CommandInput.js';
import { useGameState } from '../hooks/useGameState.js';
import { processCommand } from '../game/commandProcessor.js';
import { saveGameState } from '../game/storage.js';
import { useEffect, useState } from 'react';

export function App() {
  const [gameState, dispatch] = useGameState();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Process a command entered by the player
  const handleCommand = async (command) => {
    if (!command.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Add user command to message history
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          type: 'USER_COMMAND',
          content: command,
          timestamp: new Date().toISOString()
        }
      });
      
      // Process the command
      const result = await processCommand(command, gameState);
      
      // Update game state based on result
      if (result.gameStateChanges) {
        dispatch({
          type: 'UPDATE_GAME_STATE',
          payload: result.gameStateChanges
        });
      }
      
      // Add response message to history
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          type: result.response.action.type,
          content: result.response.narrative.mainText,
          detailContent: result.response.narrative.detailText,
          imageUrl: result.response.narrative.imageUrl,
          tone: result.response.narrative.tone,
          timestamp: new Date().toISOString()
        }
      });
      
      // Show notification if needed
      if (result.response.uiUpdates && result.response.uiUpdates.notifications) {
        result.response.uiUpdates.notifications.forEach(notification => {
          showNotification(notification.type, notification.message || 'New update available', notification.severity);
        });
      }
      
      // Save updated game state
      saveGameState(gameState);
      
    } catch (error) {
      console.error('Error processing command:', error);
      
      // Add error message
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          type: 'ERROR',
          content: 'I apologize, but I encountered an issue processing your command. Please try again or try a different approach.',
          timestamp: new Date().toISOString()
        }
      });
      
      showNotification('ERROR', 'Error processing command', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type, message, severity = 'info') => {
    setNotification({
      type,
      message,
      severity,
      id: Date.now()
    });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Check for time-based events on initial load and periodically
  useEffect(() => {
    const checkTimeEvents = () => {
      // Implementation details for time-based events
    };
    
    // Check on initial load
    checkTimeEvents();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkTimeEvents, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return React.createElement(
    'div',
    { className: 'app-container' },
    React.createElement(Header, { resources: gameState.resources }),
    React.createElement(
      'div',
      { className: 'main-content' },
      React.createElement(GameDisplay, { 
        messages: gameState.messages,
        isLoading: isLoading
      })
    ),
    React.createElement(CommandInput, { 
      onCommand: handleCommand,
      isLoading: isLoading
    }),
    notification && React.createElement(
      'div',
      { 
        className: `notification notification-${notification.severity}`,
        key: notification.id
      },
      notification.message
    )
  );
}

