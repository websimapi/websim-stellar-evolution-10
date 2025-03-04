export const initialGameState = {
  // Basic resources
  resources: {
    energy: 1000,
    minerals: 500,
    knowledge: 100,
    population: 1e9 // 1 billion
  },
  
  // Resource production per cycle
  production: {
    energy: 10,
    minerals: 5,
    knowledge: 1,
    population: 1e7 // 10 million
  },
  
  // Star systems
  starSystems: {
    'home-system': {
      id: 'home-system',
      name: 'Sol',
      type: 'G-type main-sequence',
      discovered: true,
      explored: true,
      bodies: {
        'planet-earth': {
          id: 'planet-earth',
          name: 'Earth',
          type: 'terrestrial',
          habitability: 1.0,
          resources: {
            energy: 'medium',
            minerals: 'medium'
          },
          colonized: true,
          colonyId: 'colony-earth'
        },
        'planet-mars': {
          id: 'planet-mars',
          name: 'Mars',
          type: 'terrestrial',
          habitability: 0.3,
          resources: {
            energy: 'low',
            minerals: 'high'
          },
          colonized: false
        },
        'asteroid-belt': {
          id: 'asteroid-belt',
          name: 'Asteroid Belt',
          type: 'asteroid field',
          habitability: 0,
          resources: {
            minerals: 'very high'
          }
        }
      }
    }
  },
  
  // Colonies
  colonies: {
    'colony-earth': {
      id: 'colony-earth',
      name: 'Earth',
      planetId: 'planet-earth',
      systemId: 'home-system',
      population: 1e9,
      productionFocus: 'balanced',
      buildings: [
        {
          id: 'building-research-lab',
          type: 'RESEARCH_LAB',
          level: 1
        },
        {
          id: 'building-power-plant',
          type: 'POWER_PLANT',
          level: 1
        },
        {
          id: 'building-mine',
          type: 'MINE',
          level: 1
        }
      ]
    }
  },
  
  // Technologies
  technologies: {
    'tech-solar-power': {
      id: 'tech-solar-power',
      name: 'Solar Power',
      category: 'energy',
      description: 'Efficient photovoltaic cells for energy production',
      status: 'researched',
      level: 1
    },
    'tech-nuclear-fission': {
      id: 'tech-nuclear-fission',
      name: 'Nuclear Fission',
      category: 'energy',
      description: 'Energy production through controlled atomic reactions',
      status: 'researching',
      progress: 50,
      level: 0
    },
    'tech-chemical-propulsion': {
      id: 'tech-chemical-propulsion',
      name: 'Chemical Propulsion',
      category: 'propulsion',
      description: 'Rockets using chemical reactions for thrust',
      status: 'researched',
      level: 1
    },
    'tech-ion-drive': {
      id: 'tech-ion-drive',
      name: 'Ion Drive',
      category: 'propulsion',
      description: 'Propulsion using ionized particles for efficient space travel',
      status: 'locked',
      prerequisites: ['tech-nuclear-fission'],
      level: 0
    }
  },
  
  // Facilities (space stations, outposts, etc.)
  facilities: [],
  
  // Game events
  events: [],
  
  // Game progress
  turnNumber: 1,
  
  // Message history
  messages: [
    {
      type: 'SPECIAL_EVENT',
      content: 'Welcome to Stellar Evolution. You are the leader of a fledgling stellar civilization based on Earth. Your journey to the stars begins now.',
      detailContent: 'Use the command input to guide your civilization\'s development. Try commands like "explore Mars" or "research fusion power."',
      timestamp: new Date().toISOString()
    }
  ],
  
  // Command history
  commandHistory: [],
  
  // Game settings
  settings: {
    notificationsEnabled: true,
    audioEnabled: true,
    tutorialEnabled: true
  }
};

