// Process resource updates based on time elapsed
export function processResourceUpdates(gameState, elapsedMinutes) {
  // Clone the current state to avoid direct mutations
  const newState = {
    ...gameState,
    resources: { ...gameState.resources }
  };
  
  // Update all resources based on production rates and time elapsed
  Object.keys(newState.production).forEach(resource => {
    if (newState.resources[resource] !== undefined) {
      const productionRate = newState.production[resource];
      const amountToAdd = productionRate * elapsedMinutes;
      
      newState.resources[resource] += amountToAdd;
    }
  });
  
  return newState;
}

// Process time-based events
export function advanceTimeEvents(gameState, elapsedMinutes) {
  const newState = { ...gameState };
  
  // Process research progress
  newState.technologies = processResearch(newState.technologies, elapsedMinutes, newState.resources.knowledge);
  
  // Process construction projects
  const constructionResults = processConstruction(newState.facilities, elapsedMinutes);
  newState.facilities = constructionResults.facilities;
  
  // Add construction completion events
  if (constructionResults.completedFacilities.length > 0) {
    newState.events = [
      ...newState.events,
      ...constructionResults.completedFacilities.map(facility => ({
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'CONSTRUCTION_COMPLETED',
        description: `${facility.type} construction completed at ${facility.location}`,
        timestamp: new Date().toISOString()
      }))
    ];
    
    // Add messages for completed constructions
    newState.messages = [
      ...newState.messages,
      ...constructionResults.completedFacilities.map(facility => ({
        type: 'CONSTRUCTION',
        content: `Construction of ${formatFacilityName(facility.type)} at ${facility.location} has been completed.`,
        timestamp: new Date().toISOString()
      }))
    ];
  }
  
  return newState;
}

// Process research progress
function processResearch(technologies, elapsedMinutes, knowledgeResource) {
  const newTechnologies = { ...technologies };
  
  // Calculate knowledge points to distribute
  const knowledgePerMinute = 0.5; // Base knowledge generated per minute
  const knowledgePoints = knowledgePerMinute * elapsedMinutes;
  
  // Find technologies that are currently being researched
  const researchingTechnologies = Object.values(newTechnologies)
    .filter(tech => tech.status === 'researching');
  
  // If no technologies are being researched, return unchanged
  if (researchingTechnologies.length === 0) {
    return newTechnologies;
  }
  
  // Split knowledge points among researching technologies
  const pointsPerTech = knowledgePoints / researchingTechnologies.length;
  
  // Update research progress for each technology
  researchingTechnologies.forEach(tech => {
    const currentTech = newTechnologies[tech.id];
    const newProgress = (currentTech.progress || 0) + pointsPerTech;
    
    // Check if research is completed (progress reaches 100)
    if (newProgress >= 100) {
      newTechnologies[tech.id] = {
        ...currentTech,
        status: 'researched',
        progress: 100,
        level: (currentTech.level || 0) + 1,
        completedAt: new Date().toISOString()
      };
    } else {
      newTechnologies[tech.id] = {
        ...currentTech,
        progress: newProgress
      };
    }
  });
  
  return newTechnologies;
}

// Process construction projects
function processConstruction(facilities, elapsedMinutes) {
  const newFacilities = [...facilities];
  const completedFacilities = [];
  
  // Update construction progress
  newFacilities.forEach((facility, index) => {
    if (facility.status === 'BUILDING') {
      // Calculate new completion time
      const currentTime = Date.now();
      const completionTime = new Date(facility.completionTurn).getTime();
      
      // Check if construction is completed
      if (currentTime >= completionTime) {
        // Update facility status
        newFacilities[index] = {
          ...facility,
          status: 'OPERATIONAL'
        };
        
        // Add to completed facilities
        completedFacilities.push(facility);
      }
    }
  });
  
  return {
    facilities: newFacilities,
    completedFacilities
  };
}

// Format facility name for display
function formatFacilityName(facilityType) {
  return facilityType
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

