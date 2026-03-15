
import { fetchModulesData } from '../api.js'

export async function loadModules(onSelectModule) {
  const data = await fetchModulesData()

  
  const eventMap = new Map()

  data.transaction.forEach(tx => {
    if (!eventMap.has(tx.eventId)) {
      const rawName = tx.event?.object?.name || `Event ${tx.eventId}`
      eventMap.set(tx.eventId, { xp: 0, name: rawName, newestCreatedAt: tx.createdAt })
    }
    const entry = eventMap.get(tx.eventId)
    entry.xp += tx.amount
    if (tx.createdAt > entry.newestCreatedAt) entry.newestCreatedAt = tx.createdAt
  })

  
  const nameGroups = new Map() 
  eventMap.forEach(({ name, newestCreatedAt }, eventId) => {
    if (!nameGroups.has(name)) nameGroups.set(name, [])
    nameGroups.get(name).push({ eventId, newestCreatedAt })
  })

  
  const statusMap = new Map()
  nameGroups.forEach(entries => {
    if (entries.length === 1) {
      statusMap.set(entries[0].eventId, 'single')
    } else {
      entries.sort((a, b) => b.newestCreatedAt.localeCompare(a.newestCreatedAt))
      entries.forEach((e, i) => statusMap.set(e.eventId, i === 0 ? 'pass' : 'fail'))
    }
  })

  
  const moduleButtons = document.getElementById("moduleButtons")
  let html = ""

  eventMap.forEach(({ xp, name }, eventId) => {
    const xpKB = (xp / 1000).toFixed(0)
    const status = statusMap.get(eventId)
    const statusBadge = status === 'pass'
      ? `<span class="module-status status-pass">✓ Pass</span>`
      : status === 'fail'
      ? `<span class="module-status status-fail">✗ Fail</span>`
      : `<span class="module-status status-single"></span>`

    html += `
      <button class="module-btn" data-event-id="${eventId}">
        ${name}
        ${statusBadge}
        <small>${xpKB} kB XP</small>
      </button>
    `
  })

  moduleButtons.innerHTML = html

  
  document.querySelectorAll('.module-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = parseInt(btn.getAttribute('data-event-id'))
      onSelectModule(eventId)
    })
  })
}

export function highlightSelectedModule(eventId) {
  
  document.querySelectorAll('.module-btn').forEach(btn => {
    btn.classList.remove('active')
  })
  document.querySelector(`[data-event-id="${eventId}"]`).classList.add('active')
}
