// Process a player command through the LLM
export async function processCommandLLM(command, gameState) {
  try {
    // Prepare the prompt for the LLM
    const prompt = preparePrompt(command, gameState);
    
    // Get LLM response
    const llmResponse = await getLLMResponse(prompt);
    
    // Process and validate the response
    const processedResponse = processLLMResponse(llmResponse);
    
    // Generate image if needed
    if (processedResponse.response.narrative.imagePrompt) {
      const imageUrl = await generateImage(processedResponse.response.narrative.imagePrompt);
      processedResponse.response.narrative.imageUrl = imageUrl;
    }
    
    return processedResponse;
  } catch (error) {
    console.error('Error in LLM processing:', error);
    throw error;
  }
}

// Prepare the prompt for the LLM with game state and command
function preparePrompt(command, gameState) {
  // Create a simplified version of the game state to reduce token usage
  const simplifiedGameState = simplifyGameState(gameState);
  
  // Build the prompt
  return {
    gameState: simplifiedGameState,
    userCommand: command,
    timestamp: Date.now(),
    sessionId: 'session-' + Math.random().toString(36).substring(2, 15)
  };
}

// Simplify the game state to reduce token usage
function simplifyGameState(gameState) {
  // Extract only the relevant parts of the game state for this command
  return {
    resources: gameState.resources,
    starSystems: gameState.starSystems,
    colonies: gameState.colonies,
    technologies: gameState.technologies,
    facilities: gameState.facilities,
    turnNumber: gameState.turnNumber,
    lastCommand: gameState.lastCommand,
    // Keep only the last 10 commands for context
    commandHistory: gameState.commandHistory.slice(-10)
  };
}

// Get response from LLM API
async function getLLMResponse(prompt) {
  try {
    // WebSim LLM integration
    const completion = await websim.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an advanced game engine for "Stellar Evolution", a space exploration and civilization-building game. 
Players direct their civilization through natural language commands, and you respond with rich, engaging narrative.

As the game engine, you must:
1. Process player commands related to space exploration, research, construction, colonization, etc.
2. Maintain internal game logic and state consistency
3. Generate descriptive narrative responses
4. Provide structured JSON outputs containing both narrative text and game state changes

IMPORTANT: Always respond in the exact JSON format below, with no additional text.

{
  "response": {
    "action": {
      "type": "ACTION_TYPE",
      "subtype": "SUBTYPE",
      "target": "target-id",
      "resources": { resource changes },
      "timeToComplete": number,
      "success": boolean
    },
    "gameStateChanges": {
      "resources": { resource updates },
      "facilities": [ new facilities ],
      "events": [ new events ]
    },
    "narrative": {
      "mainText": "Primary description (250-500 chars)",
      "detailText": "Additional context (optional)",
      "tone": "positive/neutral/negative/urgent",
      "imagePrompt": "Text prompt for image generation"
    },
    "uiUpdates": {
      "highlightLocations": ["location-ids"],
      "notifications": [
        {
          "type": "NOTIFICATION_TYPE",
          "message": "Notification message",
          "severity": "info/success/warning/danger"
        }
      ]
    }
  }
}

Action types must be one of: EXPLORATION, RESEARCH, CONSTRUCTION, COLONIZATION, PRODUCTION, DIPLOMACY, MANAGEMENT, COMBAT, SPECIAL_EVENT

If you cannot interpret a command, respond with a clarification in the mainText and set success: false.
Generate rich, vivid descriptions with scientific and technological details.
Maintain consistent game logic and balanced progression.`
        },
        {
          role: "user",
          content: JSON.stringify(prompt)
        }
      ],
      json: true
    });

    return JSON.parse(completion.content);
  } catch (error) {
    console.error('Error getting LLM response:', error);
    throw error;
  }
}

// Process and validate the LLM response
function processLLMResponse(llmResponse) {
  // Validate that the response has the expected structure
  if (!llmResponse || !llmResponse.response || !llmResponse.response.action) {
    throw new Error('Invalid LLM response format');
  }
  
  // Return the processed response
  return llmResponse;
}

// Generate an image based on the prompt
async function generateImage(imagePrompt) {
  try {
    // Use WebSim's image generation capability
    const result = await websim.imageGen({
      prompt: imagePrompt,
      aspect_ratio: "16:9",
    });
    
    return result.url;
  } catch (error) {
    console.error('Error generating image:', error);
    // Return null if image generation fails
    return null;
  }
}

