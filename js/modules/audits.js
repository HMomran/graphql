// Audit Ratio Module
import { fetchAuditData } from '../api.js'
import { drawAuditRatioGraph } from '../charts.js'

export async function loadAuditRatio(selectedEventId) {
  const data = await fetchAuditData(selectedEventId)

  let auditsDone = 0
  let auditsReceived = 0

  data.transaction.forEach(t => {
    if (t.type === "up") {
      auditsDone += Math.abs(t.amount)
    }

    if (t.type === "down") {
      auditsReceived += Math.abs(t.amount)
    }
  })

  let ratio = 0

  if (auditsReceived !== 0) {
    ratio = (auditsDone / auditsReceived).toFixed(2)
  }

  // Convert to MB for readability
  const auditsDoneMB = (auditsDone / 1000000).toFixed(2)
  const auditsReceivedMB = (auditsReceived / 1000000).toFixed(2)

  drawAuditRatioGraph(auditsDone, auditsReceived, ratio)
}
