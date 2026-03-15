
import { checkAuth, setupLogout } from './auth.js'
import { loadUser } from './modules/user.js'
import { loadAuditRatio } from './modules/audits.js'
import { loadXP } from './modules/xp.js'
import { loadBestSkills } from './modules/skills.js'
import { loadModules, highlightSelectedModule } from './modules/moduleSelector.js'
import { loadLastActivity, setupHistoryModal } from './modules/activity.js'

let selectedEventId = null

async function init() {
  
  if (!checkAuth()) {
    return
  }

  
  setupLogout()

  
  document.getElementById("viewProfileBtn").onclick = () => {
    document.getElementById("profileModal").style.display = "flex"
  }

  
  await loadUser()
  await loadModules(selectModule)
  
  
  setupHistoryModal(() => selectedEventId)

  
  const savedEventId = localStorage.getItem('selectedEventId')
  if (savedEventId) {
    selectModule(parseInt(savedEventId))
  }
}

function selectModule(eventId) {
  selectedEventId = eventId
  localStorage.setItem('selectedEventId', eventId)
  highlightSelectedModule(eventId)
  
  document.getElementById('profileSection').style.display = ''
  document.getElementById('statsSection').style.display = ''
  loadProfileData()
}

async function loadProfileData() {
  await Promise.all([
    loadXP(selectedEventId),
    loadAuditRatio(),
    loadBestSkills(),
    loadLastActivity(selectedEventId)
  ])
}

init()
