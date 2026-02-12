import './style.css'
import Alpine from 'alpinejs'

window.Alpine = Alpine

document.addEventListener('alpine:init', () => {
  Alpine.data('paceCalculator', () => ({
    // Distance options in kilometers
    distances: [
      { name: '5K', km: 5, miles: 3.10686 },
      { name: '10K', km: 10, miles: 6.21371 },
      { name: 'Half Marathon', km: 21.0975, miles: 13.1094 },
      { name: 'Marathon', km: 42.195, miles: 26.2188 },
    ],
    
    // Selected distance
    selectedDistance: 5, // Default to 5K
    
    // Input state
    hours: 0,
    minutes: 20,
    seconds: 0,
    
    init() {
      // No initial calculation - wait for user input
    },
    
    getTotalSeconds() {
      const h = Number(this.hours) || 0
      const m = Number(this.minutes) || 0
      const s = Number(this.seconds) || 0
      return (h * 3600) + (m * 60) + s
    },
    
    formatTime(totalSeconds) {
      if (totalSeconds <= 0) return '0:00'
      const h = Math.floor(totalSeconds / 3600)
      const m = Math.floor((totalSeconds % 3600) / 60)
      const s = Math.floor(totalSeconds % 60)
      
      if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      }
      return `${m}:${s.toString().padStart(2, '0')}`
    },
    
    formatPace(secondsPerUnit) {
      if (secondsPerUnit <= 0 || !isFinite(secondsPerUnit)) return '0:00'
      const m = Math.floor(secondsPerUnit / 60)
      const s = Math.floor(secondsPerUnit % 60)
      return `${m}:${s.toString().padStart(2, '0')}`
    },
    
    getSelectedDistanceInfo() {
      return this.distances.find(d => d.km == this.selectedDistance)
    },
    
    getPacePerKmSeconds() {
      const totalSeconds = this.getTotalSeconds()
      const distanceInfo = this.getSelectedDistanceInfo()
      if (totalSeconds <= 0 || !distanceInfo) return 300 // Default to 5:00/km
      return totalSeconds / distanceInfo.km
    },
    
    setPaceFromSlider(secondsPerKm) {
      const distanceInfo = this.getSelectedDistanceInfo()
      if (!distanceInfo) return
      const totalSeconds = Math.round(secondsPerKm * distanceInfo.km)
      this.hours = Math.floor(totalSeconds / 3600)
      this.minutes = Math.floor((totalSeconds % 3600) / 60)
      this.seconds = totalSeconds % 60
    },
    
    getPaceCalculations() {
      const totalSeconds = this.getTotalSeconds()
      const distanceInfo = this.getSelectedDistanceInfo()
      
      if (totalSeconds <= 0 || !distanceInfo) {
        return {
          pacePerKm: '0:00',
          pacePerMile: '0:00',
          speedKmh: '0.0',
          speedMph: '0.0'
        }
      }
      
      const secondsPerKm = totalSeconds / distanceInfo.km
      const secondsPerMile = totalSeconds / distanceInfo.miles
      const speedKmh = 3600 / secondsPerKm
      const speedMph = speedKmh / 1.60934
      
      return {
        pacePerKm: this.formatPace(secondsPerKm),
        pacePerMile: this.formatPace(secondsPerMile),
        speedKmh: speedKmh.toFixed(1),
        speedMph: speedMph.toFixed(1)
      }
    },
    
    getProjectedTimes() {
      const totalSeconds = this.getTotalSeconds()
      const distanceInfo = this.getSelectedDistanceInfo()
      
      if (totalSeconds <= 0 || !distanceInfo) {
        return this.distances.map(d => ({
          ...d,
          projectedTime: '0:00'
        }))
      }
      
      const secondsPerKm = totalSeconds / distanceInfo.km
      
      return this.distances.map(d => {
        const projectedTime = secondsPerKm * d.km
        return {
          ...d,
          projectedTime: this.formatTime(projectedTime)
        }
      })
    },

    parsePaceInput(paceStr) {
      // Parse pace input like "4:30" or "4.5" into seconds
      if (!paceStr || paceStr.trim() === '') return null
      paceStr = paceStr.trim()
      
      // Try colon format: 4:30
      if (paceStr.includes(':')) {
        const parts = paceStr.split(':')
        const minutes = parseInt(parts[0]) || 0
        const seconds = parseInt(parts[1]) || 0
        return (minutes * 60) + seconds
      }
      
      // Try decimal format: 4.5 = 4:30
      const decimal = parseFloat(paceStr)
      if (!isNaN(decimal) && decimal > 0) {
        const minutes = Math.floor(decimal)
        const seconds = Math.round((decimal - minutes) * 60)
        return (minutes * 60) + seconds
      }
      
      return null
    },
    
    setTimeFromPacePerKm(paceStr) {
      const secondsPerKm = this.parsePaceInput(paceStr)
      if (secondsPerKm === null || secondsPerKm <= 0) return
      
      const distanceInfo = this.getSelectedDistanceInfo()
      if (!distanceInfo) return
      
      const totalSeconds = Math.round(secondsPerKm * distanceInfo.km)
      this.hours = Math.floor(totalSeconds / 3600)
      this.minutes = Math.floor((totalSeconds % 3600) / 60)
      this.seconds = totalSeconds % 60
    },
    
    setTimeFromPacePerMile(paceStr) {
      const secondsPerMile = this.parsePaceInput(paceStr)
      if (secondsPerMile === null || secondsPerMile <= 0) return
      
      const distanceInfo = this.getSelectedDistanceInfo()
      if (!distanceInfo) return
      
      const totalSeconds = Math.round(secondsPerMile * distanceInfo.miles)
      this.hours = Math.floor(totalSeconds / 3600)
      this.minutes = Math.floor((totalSeconds % 3600) / 60)
      this.seconds = totalSeconds % 60
    },
    
    setTimeFromSpeedKmh(speedStr) {
      const speedKmh = parseFloat(speedStr)
      if (isNaN(speedKmh) || speedKmh <= 0) return
      
      const distanceInfo = this.getSelectedDistanceInfo()
      if (!distanceInfo) return
      
      // time = distance / speed
      const totalSeconds = Math.round((distanceInfo.km / speedKmh) * 3600)
      this.hours = Math.floor(totalSeconds / 3600)
      this.minutes = Math.floor((totalSeconds % 3600) / 60)
      this.seconds = totalSeconds % 60
    },
    
    setTimeFromSpeedMph(speedStr) {
      const speedMph = parseFloat(speedStr)
      if (isNaN(speedMph) || speedMph <= 0) return
      
      const distanceInfo = this.getSelectedDistanceInfo()
      if (!distanceInfo) return
      
      const totalSeconds = Math.round((distanceInfo.miles / speedMph) * 3600)
      this.hours = Math.floor(totalSeconds / 3600)
      this.minutes = Math.floor((totalSeconds % 3600) / 60)
      this.seconds = totalSeconds % 60
    }
  }))
})

Alpine.start()
