
import { fetchXPData } from '../api.js'
import { drawXPGraph } from '../charts.js'

export async function loadXP(selectedEventId) {
  const data = await fetchXPData(selectedEventId)

  if (!data || !data.transaction || data.transaction.length === 0) {
    document.getElementById("xpGraph").innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem;">📊 No XP data available for this module.</p>
      </div>
    `
    return
  }

  data.transaction.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  drawXPGraph(data.transaction)
}
