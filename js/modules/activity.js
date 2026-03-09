// Activity Module
import { fetchXPData, fetchRecentActivity, fetchAllProjects } from '../api.js'

export async function loadLastActivity(selectedEventId) {
  if (!selectedEventId) {
    document.getElementById("lastActivity").innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem;">📊 Please select a module to view activity</p>
      </div>
    `
    return
  }

  // Fetch total XP for the badge
  const totalData = await fetchXPData(selectedEventId)
  const totalXP = totalData.transaction.reduce((sum, t) => sum + t.amount, 0)

  // Fetch last 4 projects for display
  const recentData = await fetchRecentActivity(selectedEventId, 4)

  let html = `<div class="xp-badge"><span class="xp-icon">XP</span> ${(totalXP / 1000).toFixed(0)} kB</div>`

  recentData.transaction.forEach(tx => {
    const projectName = tx.path.split('/').pop()
    const xpKB = (tx.amount / 1000).toFixed(1)
    html += `
      <div class="activity-item">
        <div class="activity-icon">🚀</div>
        <div class="activity-details">
          <span class="activity-project">${projectName}</span>
          <span class="activity-xp">${xpKB} kB</span>
        </div>
        <div class="activity-check">✓</div>
      </div>
    `
  })

  document.getElementById("lastActivity").innerHTML = html
}

export function setupHistoryModal(getSelectedEventId) {
  document.getElementById("seeHistory").addEventListener("click", () => {
    showHistoryModal(getSelectedEventId())
  })
  
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("historyModal")
    if (e.target === modal) {
      closeHistoryModal()
    }
  })
}

function showHistoryModal(selectedEventId) {
  document.getElementById("historyModal").style.display = "flex"
  loadAllProjectsHistory(selectedEventId)
}

export function closeHistoryModal() {
  document.getElementById("historyModal").style.display = "none"
}

async function loadAllProjectsHistory(selectedEventId) {
  if (!selectedEventId) {
    document.getElementById("historyList").innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>Please select a module first</p>
      </div>
    `
    return
  }

  const data = await fetchAllProjects(selectedEventId)

  let html = '<div class="history-items">'
  
  data.transaction.forEach(tx => {
    const projectName = tx.path.split('/').pop()
    const xpKB = (tx.amount / 1000).toFixed(1)
    const date = new Date(tx.createdAt).toLocaleDateString()
    html += `
      <div class="history-item">
        <div class="history-icon">🚀</div>
        <div class="history-info">
          <div class="history-project">${projectName}</div>
          <div class="history-path">${tx.path}</div>
          <div class="history-date">${date}</div>
        </div>
        <div class="history-xp">${xpKB} kB</div>
      </div>
    `
  })
  
  html += '</div>'
  document.getElementById("historyList").innerHTML = html
}
