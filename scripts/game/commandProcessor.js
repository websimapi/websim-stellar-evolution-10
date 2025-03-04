import { processCommandLLM } from '../llm/llmProcessor.js';
import { loadGameState } from './storage.js';

// Process a command entered by the player
export async function processCommand(command, gameState) {
  try {
    // Add command to history
    const updatedGameState = {
      ...gameState,
      commandHistory: [
        ...gameState.commandHistory,
        command
      ],
      lastCommand: command
    };
    
    // Prepare LLM request
    const llmResponse = await processCommandLLM(command, updatedGameState);
    
    return llmResponse;
  } catch (error) {
    console.error('Error processing command:', error);
    
    // Return a fallback response in case of error
    return {
      response: {
        action: {
          type: 'ERROR',
          success: false
        },
        narrative: {
          mainText: 'I apologize, but I encountered an issue processing your command. Please try again or try a different approach.',
          tone: 'negative'
        },
        uiUpdates: {
          notifications: [
            {
              type: 'ERROR',
              message: 'Error processing command',
              severity: 'danger'
            }
          ]
        }
      }
    };
  }
}

