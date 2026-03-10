// Audit Ratio Module
import { fetchAuditData } from '../api.js'
import { drawAuditRatioGraph } from '../charts.js'

export async function loadAuditRatio() {
  const data = await fetchAuditData()

  if (!data || !data.transaction) return

  let auditsDone = 0
  let auditsReceived = 0

  data.transaction.forEach(t => {
    if (t.type === 'up') auditsDone += t.amount
    else if (t.type === 'down') auditsReceived += t.amount
  })

  let ratio = auditsReceived
    ? Number((auditsDone / auditsReceived).toFixed(1))
    : 0

  drawAuditRatioGraph(auditsDone, auditsReceived, ratio)
}