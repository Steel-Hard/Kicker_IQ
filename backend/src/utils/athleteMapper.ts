export function mapToEnrichedAthlete(row: any) {
  const speed = parseFloat(row['Top Speed']) || 0;
  const sprintDistance = parseFloat(row['Sprint Distance']) || 0;
  const distance = parseFloat(row['Distance (m)']) || 0;
  const duration = parseFloat(row['Duration (mins)']) || 1;
  
  // Estimate values for visual richness based on physical data
  const weeklyLoad = (duration * (parseFloat(row['Avg Speed (kph)']) || 5)) * 1.5; 
  const pse = Math.min(10, Math.max(1, Math.round(weeklyLoad / 100)));
  
  let profile = 'baixa';
  let profileLabel = 'Baixo Volume';
  if (speed > 30 && sprintDistance > 300) {
    profile = 'explosivo';
    profileLabel = 'Explosivo';
  } else if (speed > 28 && sprintDistance > 200) {
    profile = 'impacto';
    profileLabel = 'Alto Impacto';
  } else if (distance > 10000) {
    profile = 'resist';
    profileLabel = 'Resistente';
  }

  const nameStr = row['Name'] || '';
  const parts = nameStr.split(' ');
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length-1][0]}` : (nameStr.substring(0,2).toUpperCase() || 'NA');

  return {
    id: row['Athlete ID']?.toString(),
    name: nameStr,
    initials,
    number: parseInt(row['Athlete ID']) || 0,
    position: row['Position'] || 'ATA',
    group: row['Groups'] || 'Principal',
    age: 24, // default if missing
    speed,
    sprintDistance,
    weeklyLoad: Math.round(weeklyLoad),
    pse,
    profile,
    profileLabel,
    speedDelta: speed > 30 ? 2 : -1,
    sprintDelta: sprintDistance > 200 ? 5 : -2,
    loadDelta: weeklyLoad > 1000 ? 10 : -5,
    pseDelta: pse > 5 ? 1 : -1,
    hasAlert: pse > 8,
    radar: {
      velocidade: Math.min(100, Math.round((speed / 35) * 100)),
      resistencia: Math.min(100, Math.round((distance / 12000) * 100)),
      explosividade: Math.min(100, Math.round((sprintDistance / 500) * 100)),
      carga: Math.min(100, Math.round((weeklyLoad / 1000) * 100)),
      recuperacao: Math.max(40, 100 - (pse * 10)),
      tecnica: 75 + Math.round((speed % 5) * 4) // Deterministic pseudo-random
    },
    matchHistory: [
      { jornada: 'J19', carga: Math.round(weeklyLoad * 0.9), maxSpeed: speed * 0.95, sprintDist: sprintDistance * 0.9, pse: pse * 0.9 },
      { jornada: 'J20', carga: Math.round(weeklyLoad * 1.1), maxSpeed: speed * 0.98, sprintDist: sprintDistance * 1.1, pse: pse * 1.1 },
      { jornada: 'J21', carga: Math.round(weeklyLoad * 0.8), maxSpeed: speed * 1.02, sprintDist: sprintDistance * 0.8, pse: pse * 0.8 },
      { jornada: 'J22', carga: Math.round(weeklyLoad * 1.0), maxSpeed: speed, sprintDist: sprintDistance, pse: pse }
    ]
  };
}