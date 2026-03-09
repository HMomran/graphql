// XP Module
import { fetchXPData } from '../api.js'
import { drawXPGraph } from '../charts.js'

export async function loadXP(selectedEventId) {
  const data = await fetchXPData(selectedEventId)

  data.transaction.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  drawXPGraph(data.transaction)
}
