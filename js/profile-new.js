// Main Profile Orchestrator
import { checkAuth, setupLogout } from './auth.js'
import { loadUser } from './modules/user.js'
import { loadAuditRatio } from './modules/audits.js'
import { loadXP } from './modules/xp.js'
import { loadBestSkills } from './modules/skills.js'
import { loadModules, highlightSelectedModule } from './modules/moduleSelector.js'
import { loadLastActivity, setupHistoryModal } from './modules/activity.js'

// Global state
let selectedEventId = null

// Initialize application
async function init() {
  // Check authentication
  if (!checkAuth()) {
    return
  }

  // Setup logout handler
  setupLogout()

  // Wire View Profile button (always in header DOM)
  document.getElementById("viewProfileBtn").onclick = () => {
    document.getElementById("profileModal").style.display = "flex"
  }

  // Load initial data
  await loadUser()
  await loadModules(selectModule)
  
  // Setup modal handlers
  setupHistoryModal(() => selectedEventId)

  // Restore last selected module
  const savedEventId = localStorage.getItem('selectedEventId')
  if (savedEventId) {
    selectModule(parseInt(savedEventId))
  }
}

// Handle module selection
function selectModule(eventId) {
  selectedEventId = eventId
  localStorage.setItem('selectedEventId', eventId)
  highlightSelectedModule(eventId)
  // Reveal content sections on first selection
  document.getElementById('profileSection').style.display = ''
  document.getElementById('statsSection').style.display = ''
  loadProfileData()
}

// Load all profile data for selected module
async function loadProfileData() {
  await loadXP(selectedEventId)
  await loadAuditRatio()
  await loadBestSkills()
  await loadLastActivity(selectedEventId)
}

// Start the application
init()
