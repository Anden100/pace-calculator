// VDOT Calculator - Jack Daniels' Running Formula
// Based on Jack Daniels' VDOT tables and formulas

/**
 * Calculate VDOT score from race performance
 * @param {number} distanceMeters - Race distance in meters
 * @param {number} timeMinutes - Race time in minutes
 * @returns {number} VDOT score (rounded to 1 decimal)
 */
export function calculateVDOT(distanceMeters, timeMinutes) {
  const velocity = distanceMeters / timeMinutes // meters per minute
  
  // Daniels' formula for VO2 cost of running
  const vo2Cost = -4.60 + (0.182258 * velocity) + (0.000104 * velocity * velocity)
  
  // Fraction of VO2 max utilized based on duration
  const percentVO2Max = 0.8 + 
    (0.1894393 * Math.exp(-0.012778 * timeMinutes)) + 
    (0.2989558 * Math.exp(-0.1932605 * timeMinutes))
  
  // VDOT is VO2 cost divided by percentage utilized
  const vdot = vo2Cost / percentVO2Max
  
  return Math.round(vdot * 10) / 10
}

/**
 * Calculate race time for a given distance and VDOT score
 * Uses Newton-Raphson iteration to solve for time
 * @param {number} distanceMeters - Target race distance in meters
 * @param {number} vdot - VDOT score
 * @returns {number} Race time in minutes
 */
export function calculateTimeFromVDOT(distanceMeters, vdot) {
  // Initial guess based on typical running velocities
  // Start with a velocity that roughly corresponds to the VDOT
  let timeMinutes = distanceMeters / (vdot * 20) // Rough approximation
  
  // Newton-Raphson iteration to solve for time
  const maxIterations = 50
  const tolerance = 0.001
  
  for (let i = 0; i < maxIterations; i++) {
    const velocity = distanceMeters / timeMinutes
    const vo2Cost = -4.60 + (0.182258 * velocity) + (0.000104 * velocity * velocity)
    const percentVO2Max = 0.8 + 
      (0.1894393 * Math.exp(-0.012778 * timeMinutes)) + 
      (0.2989558 * Math.exp(-0.1932605 * timeMinutes))
    
    const calculatedVDOT = vo2Cost / percentVO2Max
    const error = calculatedVDOT - vdot
    
    if (Math.abs(error) < tolerance) {
      break
    }
    
    // Derivative approximation for Newton-Raphson
    const dt = 0.01
    const velocityNext = distanceMeters / (timeMinutes + dt)
    const vo2CostNext = -4.60 + (0.182258 * velocityNext) + (0.000104 * velocityNext * velocityNext)
    const percentVO2MaxNext = 0.8 + 
      (0.1894393 * Math.exp(-0.012778 * (timeMinutes + dt))) + 
      (0.2989558 * Math.exp(-0.1932605 * (timeMinutes + dt)))
    const vdotNext = vo2CostNext / percentVO2MaxNext
    const derivative = (vdotNext - calculatedVDOT) / dt
    
    // Update time estimate
    if (Math.abs(derivative) > 0.0001) {
      timeMinutes = timeMinutes - (error / derivative)
    } else {
      // Fallback if derivative is too small
      timeMinutes = timeMinutes * (1 - error * 0.01)
    }
    
    // Ensure time stays positive
    if (timeMinutes <= 0) {
      timeMinutes = 1
    }
  }
  
  return timeMinutes
}

/**
 * Standard race distances with their distances in kilometers and meters
 */
export const RACE_DISTANCES = [
  { name: '1500m', km: 1.5, meters: 1500 },
  { name: 'Mile', km: 1.60934, meters: 1609.34 },
  { name: '3K', km: 3, meters: 3000 },
  { name: '5K', km: 5, meters: 5000 },
  { name: '8K', km: 8, meters: 8000 },
  { name: '10K', km: 10, meters: 10000 },
  { name: '15K', km: 15, meters: 15000 },
  { name: 'Half Marathon', km: 21.0975, meters: 21097.5 },
  { name: 'Marathon', km: 42.195, meters: 42195 },
]

/**
 * Calculate projected times for all standard distances based on VDOT
 * @param {number} vdot - VDOT score
 * @returns {Array} Array of objects with distance name and projected time
 */
export function getVDOTProjectedTimes(vdot) {
  return RACE_DISTANCES.map(distance => {
    const timeMinutes = calculateTimeFromVDOT(distance.meters, vdot)
    const totalSeconds = Math.round(timeMinutes * 60)
    
    return {
      name: distance.name,
      km: distance.km,
      meters: distance.meters,
      projectedMinutes: timeMinutes,
      projectedSeconds: totalSeconds
    }
  })
}

/**
 * Format seconds as HH:MM:SS or MM:SS
 * @param {number} totalSeconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(totalSeconds) {
  if (totalSeconds <= 0) return '0:00'
  
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Get VDOT training zones based on a VDOT score
 * Returns training paces as seconds per km
 * @param {number} vdot - VDOT score
 * @returns {Object} Training zones with pace ranges
 */
export function getTrainingZones(vdot) {
  // These are approximations based on Daniels' tables
  // Easy pace: ~59-74% of VO2 max velocity (roughly VDOT - 10 to VDOT - 5)
  // Marathon pace: ~75-84% of VO2 max velocity (roughly VDOT - 2)
  // Threshold pace: ~83-88% of VO2 max velocity (roughly VDOT + 0)
  // Interval pace: ~97-100% of VO2 max velocity (roughly VDOT + 3 to +5)
  // Repetition pace: ~105-110% of VO2 max velocity (roughly VDOT + 6 to +8)
  
  // We'll calculate based on equivalent race times for shorter distances
  const easyVDOT = vdot - 8
  const marathonVDOT = vdot - 2
  const thresholdVDOT = vdot + 0.5
  const intervalVDOT = vdot + 4
  const repVDOT = vdot + 7
  
  // Calculate paces for 1km at each VDOT level
  const easyTime = calculateTimeFromVDOT(1000, easyVDOT)
  const marathonTime = calculateTimeFromVDOT(1000, marathonVDOT)
  const thresholdTime = calculateTimeFromVDOT(1000, thresholdVDOT)
  const intervalTime = calculateTimeFromVDOT(1000, intervalVDOT)
  const repTime = calculateTimeFromVDOT(1000, repVDOT)
  
  return {
    easy: {
      name: 'Easy',
      minSecPerKm: Math.round(easyTime * 60 * 1.15), // Slower end
      maxSecPerKm: Math.round(easyTime * 60 * 0.95), // Faster end
      description: 'Recovery and easy aerobic runs'
    },
    marathon: {
      name: 'Marathon Pace',
      secPerKm: Math.round(marathonTime * 60),
      description: 'Goal marathon race pace'
    },
    threshold: {
      name: 'Threshold',
      minSecPerKm: Math.round(thresholdTime * 60 * 1.03),
      maxSecPerKm: Math.round(thresholdTime * 60 * 0.97),
      description: 'Comfortably hard tempo runs'
    },
    interval: {
      name: 'Interval',
      minSecPerKm: Math.round(intervalTime * 60 * 1.02),
      maxSecPerKm: Math.round(intervalTime * 60 * 0.98),
      description: 'VO2 max intervals'
    },
    repetition: {
      name: 'Repetition',
      secPerKm: Math.round(repTime * 60),
      description: 'Fast, short repetitions'
    }
  }
}

/**
 * Format pace as M:SS per km
 * @param {number} secondsPerKm - Pace in seconds per km
 * @returns {string} Formatted pace
 */
export function formatPace(secondsPerKm) {
  if (secondsPerKm <= 0 || !isFinite(secondsPerKm)) return '0:00'
  const m = Math.floor(secondsPerKm / 60)
  const s = Math.floor(secondsPerKm % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
