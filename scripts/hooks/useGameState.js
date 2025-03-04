import { useReducer, useEffect } from 'react';
import { loadGameState, saveGameState } from '../game/storage.js';
import { initialGameState } from '../game/initialState.js';

function gameStateReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE':
      return action.payload;
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
      
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        ...action.payload,
        resources: {
          ...state.resources,
          ...(action.payload.resources || {})
        },
        technologies: {
          ...state.technologies,
          ...(action.payload.technologies || {})
        },
        starSystems: {
          ...state.starSystems,
          ...(action.payload.starSystems || {})
        },
        colonies: {
          ...state.colonies,
          ...(action.payload.colonies || {})
        },
        facilities: [
          ...(state.facilities || []),
          ...(action.payload.facilities || [])
        ].filter((facility, index, self) => 
          index === self.findIndex(f => f.id === facility.id)
        ),
        events: [
          ...(state.events || []),
          ...(action.payload.events || [])
        ]
      };
      
    case 'DISCOVER_STAR_SYSTEM':
      return {
        ...state,
        starSystems: {
          ...state.starSystems,
          [action.payload.id]: action.payload
        }
      };
      
    case 'RESEARCH_TECHNOLOGY':
      return {
        ...state,
        technologies: {
          ...state.technologies,
          [action.payload.id]: {
            ...state.technologies[action.payload.id],
            ...action.payload
          }
        }
      };
      
    case 'ESTABLISH_COLONY':
      return {
        ...state,
        colonies: {
          ...state.colonies,
          [action.payload.id]: action.payload
        }
      };
      
    case 'UPDATE_RESOURCE':
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.payload.resource]: state.resources[action.payload.resource] + action.payload.amount
        }
      };
      
    default:
      return state;
  }
}

export function useGameState() {
  const [gameState, dispatch] = useReducer(gameStateReducer, null, () => {
    const savedState = loadGameState();
    return savedState || initialGameState;
  });
  
  // Save game state on changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);
  
  return [gameState, dispatch];
}

