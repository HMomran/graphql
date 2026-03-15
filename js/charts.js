

export function drawXPGraph(transactions) {
  const width = 810
  const height = 320
  const padding = { top: 24, right: 40, bottom: 90, left: 80 }
  const graphWidth = width - padding.left - padding.right
  const graphHeight = height - padding.top - padding.bottom

  let points = ""
  let stepX = graphWidth / (transactions.length - 1)

  
  const sorted = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  let cumulative = 0
  const cumulativeData = sorted.map(t => {
    cumulative += t.amount
    return { amount: cumulative, date: new Date(t.createdAt), path: t.path, xpGained: t.amount }
  })

  let totalXP = cumulative
  let maxXP = totalXP
  let minXP = 0

  
  const today = new Date()
  const lastDate = cumulativeData[cumulativeData.length - 1].date
  let todayAdded = false
  if (lastDate.toDateString() !== today.toDateString()) {
    cumulativeData.push({ amount: totalXP, date: today })
    todayAdded = true
  }

  
  const startDate = cumulativeData[0].date
  const endDate = today
  const totalTimeMs = endDate - startDate

  const durationMs = totalTimeMs
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24))
  const durationMonths = Math.floor(durationDays / 30)

  const startDateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const endDateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const endLabel = 'Today'

  
  let pointsArray = []
  const yBottom = padding.top + graphHeight  
  cumulativeData.forEach(d => {
    const timeOffset = d.date - startDate
    const x = padding.left + (timeOffset / totalTimeMs) * graphWidth
    const y = padding.top + graphHeight - ((d.amount - minXP) / (maxXP - minXP || 1)) * graphHeight
    points += `${x},${y} `
    pointsArray.push({ x, y, amount: d.amount, date: d.date })
  })

  
  let svg = `<svg viewBox="0 0 ${width} ${height + 40}" style="width: 100%; height: auto; display: block;">`

  
  svg += `
    <defs>
      <linearGradient id="xpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#4facfe;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:0.3" />
      </linearGradient>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#00f2fe;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#43e97b;stop-opacity:1" />
      </linearGradient>
    </defs>
  `

  
  const yAxisSteps = 5
  for (let i = 0; i <= yAxisSteps; i++) {
    const y = padding.top + (graphHeight / yAxisSteps) * i
    const value = maxXP - ((maxXP - minXP) / yAxisSteps) * i
    
    
    svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(102, 126, 234, 0.2)" stroke-width="1" stroke-dasharray="5,5"/>`
    
    
    svg += `<text x="${padding.left - 10}" y="${y + 5}" text-anchor="end" fill="#a0a0b0" font-size="12" font-weight="600">${(value / 1000).toFixed(1)}k</text>`
  }

  
  let areaPoints = points + `${width - padding.right},${yBottom} ${padding.left},${yBottom}`
  svg += `<polygon points="${areaPoints}" fill="url(#xpGradient)" opacity="0.4"/>`

  
  svg += `
    <polyline
      fill="none"
      stroke="url(#lineGradient)"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
      points="${points}"
      filter="drop-shadow(0 0 8px rgba(79, 172, 254, 0.6))"
    />
  `

  
  const showEvery = Math.max(1, Math.floor(transactions.length / 8))
  const labeledX = [] 
  const minLabelGap = 60
  pointsArray.forEach((point, i) => {
    if (i % showEvery === 0 || i === pointsArray.length - 1 || i === 0) {
      
      const isStartOrEnd = i === 0 || i === pointsArray.length - 1
      const circleSize = isStartOrEnd ? 7 : 5
      svg += `<circle cx="${point.x}" cy="${point.y}" r="${circleSize}" fill="#00f2fe" stroke="white" stroke-width="2" filter="drop-shadow(0 0 6px rgba(0, 242, 254, 0.8))"/>`

      
      const wantsLabel = i === pointsArray.length - 1 || i === 0 || point.amount === maxXP
      const tooClose = labeledX.some(lx => Math.abs(lx - point.x) < minLabelGap)
      if (wantsLabel && !tooClose) {
        svg += `<text x="${point.x}" y="${point.y - 15}" text-anchor="middle" fill="#00f2fe" font-size="12" font-weight="700">${(point.amount / 1000).toFixed(1)}k</text>`
        labeledX.push(point.x)
      }
    }
  })

  
  const lastRealIdx = todayAdded ? pointsArray.length - 2 : pointsArray.length - 1
  const lastReal = pointsArray[lastRealIdx]
  if (lastReal && sorted.length > 0) {
    const lastProject = sorted[sorted.length - 1]
    const projectName = (lastProject.path || '').split('/').filter(s => s).pop() || 'Last Project'
    const boxW = 178, boxH = 50
    const boxX = Math.min(Math.max(lastReal.x - boxW / 2, padding.left), width - padding.right - boxW)
    const boxY = Math.max(padding.top + 4, lastReal.y - 74)
    svg += `<line x1="${lastReal.x}" y1="${lastReal.y - 8}" x2="${lastReal.x}" y2="${boxY + boxH}" stroke="#43e97b" stroke-width="1.5" stroke-dasharray="4,3"/>`
    svg += `<text x="${boxX + boxW / 2}" y="${boxY + 18}" text-anchor="middle" fill="#43e97b" font-size="11" font-weight="700">${projectName}</text>`
    svg += `<text x="${boxX + boxW / 2}" y="${boxY + 37}" text-anchor="middle" fill="#a0a0b0" font-size="10">+${(lastProject.amount / 1000).toFixed(1)}k → ${(lastReal.amount / 1000).toFixed(1)}k total</text>`
  }

  
  svg += `<text x="${padding.left - 60}" y="${height / 2}" text-anchor="middle" fill="#4facfe" font-size="13" font-weight="700" transform="rotate(-90, ${padding.left - 60}, ${height / 2})">XP Amount</text>`
  
  
  const startX = padding.left
  const startY = height - padding.bottom + 25
  svg += `<text x="${startX}" y="${startY}" text-anchor="start" fill="#4facfe" font-size="13" font-weight="700">Start</text>`
  svg += `<text x="${startX}" y="${startY + 18}" text-anchor="start" fill="#a0a0b0" font-size="11">${startDateStr}</text>`
  
  
  const endX = width - padding.right
  svg += `<text x="${endX}" y="${startY}" text-anchor="end" fill="#43e97b" font-size="13" font-weight="700">${endLabel}</text>`
  svg += `<text x="${endX}" y="${startY + 18}" text-anchor="end" fill="#a0a0b0" font-size="11">${endDateStr}</text>`

  
  const durationText = durationMonths > 0 ? `${durationMonths} ${durationMonths === 1 ? 'month' : 'months'}` : `${durationDays} days`
  svg += `<text x="${width / 2}" y="${height - 5}" text-anchor="middle" fill="#667eea" font-size="12" font-weight="600" opacity="0.8">Journey: ${durationText}</text>`

  svg += `</svg>`

  
  const statsHTML = `
    <div class="xp-timeline-header">
      <div class="timeline-title">
        <span class="timeline-from">From ${startDateStr}</span>
        <span class="timeline-arrow">→</span>
        <span class="timeline-to">${endLabel} 🎯</span>
      </div>
      <div class="timeline-duration">${durationText} of progress</div>
    </div>
    <div class="xp-stats">
      <div class="xp-stat-card">
        <div class="xp-stat-label">Total XP</div>
        <div class="xp-stat-value">${(totalXP / 1000).toFixed(1)}<small>k</small></div>
      </div>
      <div class="xp-stat-card">
        <div class="xp-stat-label">Best Single</div>
        <div class="xp-stat-value">${(Math.max(...transactions.map(t => t.amount)) / 1000).toFixed(1)}<small>k</small></div>
      </div>
      <div class="xp-stat-card">
        <div class="xp-stat-label">Avg / Project</div>
        <div class="xp-stat-value">${(totalXP / transactions.length / 1000).toFixed(1)}<small>k</small></div>
      </div>
      <div class="xp-stat-card">
        <div class="xp-stat-label">Projects</div>
        <div class="xp-stat-value">${transactions.length}</div>
      </div>
    </div>
  `

  document.getElementById("xpGraph").innerHTML = statsHTML + svg
}

export function drawRadarChart(data, elementId, color = "#4facfe") {
  const width = 380
  const height = 380
  const centerX = width / 2
  const centerY = height / 2
  const radius = 130
  const levels = 5

  const skills = Object.keys(data)
  const angleStep = (Math.PI * 2) / skills.length

  
  const maxValue = Math.max(...Object.values(data))

  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">`

  
  svg += `
    <defs>
      <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4facfe;stop-opacity:0.8" />
        <stop offset="50%" style="stop-color:#667eea;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:0.8" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `

  
  for (let i = 1; i <= levels; i++) {
    const r = (radius / levels) * i
    const opacity = 0.15 + (i * 0.05)
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="#667eea" stroke-width="2" opacity="${opacity}"/>`
    
    
    if (i < levels) {
      const value = Math.round((maxValue / levels) * i)
      svg += `<text x="${centerX}" y="${centerY - r + 5}" text-anchor="middle" fill="#a0a0b0" font-size="8" opacity="0.6">${value}</text>`
    }
  }

  
  skills.forEach((skill, i) => {
    const angle = angleStep * i - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    
    
    svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#667eea" stroke-width="2" opacity="0.4"/>`
    
    
    const labelDistance = radius + 30
    const labelX = centerX + labelDistance * Math.cos(angle)
    const labelY = centerY + labelDistance * Math.sin(angle)
    
    
    const labelWidth = skill.length * 6 + 14
    
    
    svg += `<text x="${labelX}" y="${labelY + 4}" text-anchor="middle" fill="#00f2fe" font-size="11" font-weight="700">${skill}</text>`
  })

  
  let points = ""
  let valuePoints = []
  skills.forEach((skill, i) => {
    const angle = angleStep * i - Math.PI / 2
    const value = data[skill]
    const distance = (value / maxValue) * radius
    const x = centerX + distance * Math.cos(angle)
    const y = centerY + distance * Math.sin(angle)
    points += `${x},${y} `
    valuePoints.push({ x, y, value, skill })
  })

  
  svg += `<polygon points="${points}" fill="url(#radarGradient)" opacity="0.7" stroke="#00f2fe" stroke-width="2" filter="url(#glow)"/>`

  
  valuePoints.forEach(point => {
    svg += `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#00f2fe" stroke="white" stroke-width="1.5" filter="drop-shadow(0 0 6px rgba(0, 242, 254, 0.8))"/>`
    
    
    svg += `<text x="${point.x}" y="${point.y - 9}" text-anchor="middle" fill="#43e97b" font-size="9" font-weight="700">${point.value}%</text>`
  })

  svg += `</svg>`

  document.getElementById(elementId).innerHTML = svg
}

export function drawAuditRatioGraph(done, received, ratio) {
  const width = 400
  const height = 210
  const barHeight = 30
  const startX = 64
  const maxBarWidth = 280

  const doneMB = (done / 1000000).toFixed(2)
  const receivedMB = (received / 1000000).toFixed(2)
  const doneBarWidth = received > 0 ? Math.min((done / received) * maxBarWidth, maxBarWidth) : 0

  let color, message
  if (ratio >= 1)        { color = "#22c55e"; message = "PERFECT!" }
  else if (ratio >= 0.8) { color = "#3b82f6"; message = "ALMOST THERE!" }
  else if (ratio >= 0.5) { color = "#f59e0b"; message = "KEEP GOING!" }
  else                   { color = "#ef4444"; message = "CAREFUL BUDDY!" }

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="doneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#238636"/>
          <stop offset="100%" style="stop-color:#2ea043"/>
        </linearGradient>
        <linearGradient id="recvGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#1f6feb"/>
          <stop offset="100%" style="stop-color:#388bfd"/>
        </linearGradient>
        <filter id="barGlow">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Done bar -->
      <text x="${startX}" y="22" fill="#8b949e" font-size="11" font-weight="700" letter-spacing="1">DONE</text>
      <rect x="${startX}" y="28" width="${maxBarWidth}" height="${barHeight}" rx="6" fill="rgba(46,160,67,0.12)"/>
      <rect x="${startX}" y="28" width="${doneBarWidth}" height="${barHeight}" rx="6" fill="url(#doneGrad)" filter="url(#barGlow)"/>
      <text x="${startX + maxBarWidth + 10}" y="${28 + barHeight / 2 + 5}" fill="#c9d1d9" font-size="13" font-weight="700">${doneMB} MB</text>

      <!-- Received bar -->
      <text x="${startX}" y="88" fill="#8b949e" font-size="11" font-weight="700" letter-spacing="1">RECEIVED</text>
      <rect x="${startX}" y="94" width="${maxBarWidth}" height="${barHeight}" rx="6" fill="rgba(56,139,253,0.12)"/>
      <rect x="${startX}" y="94" width="${maxBarWidth}" height="${barHeight}" rx="6" fill="url(#recvGrad)" filter="url(#barGlow)"/>
      <text x="${startX + maxBarWidth + 10}" y="${94 + barHeight / 2 + 5}" fill="#c9d1d9" font-size="13" font-weight="700">${receivedMB} MB</text>

      <!-- Ratio -->
      <text x="${width / 2}" y="165" text-anchor="middle" fill="${color}" font-size="42" font-weight="800"
            filter="drop-shadow(0 0 12px ${color})">${ratio}</text>
      <text x="${width / 2}" y="193" text-anchor="middle" fill="${color}" font-size="13" font-weight="700"
            letter-spacing="2">${message}</text>
    </svg>
  `

  document.getElementById("auditRatioGraph").innerHTML = svg
}

export function drawSkillDetails(skillsData, elementId) {
  const totalValue = Object.values(skillsData).reduce((sum, val) => sum + val, 0)
  
  let html = '<div class="skill-details">'
  
  Object.entries(skillsData)
    .sort((a, b) => b[1] - a[1])
    .forEach(([skill, value]) => {
      const percentage = ((value / totalValue) * 100).toFixed(1)
      const displayValue = (value / 1000).toFixed(1)
      
      html += `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">${skill}</span>
            <span class="skill-value">${displayValue} kB</span>
          </div>
          <div class="skill-bar-wrapper">
            <div class="skill-bar" style="width: ${percentage}%"></div>
            <span class="skill-percentage">${percentage}%</span>
          </div>
        </div>
      `
    })
  
  html += '</div>'
  
  const container = document.getElementById(elementId)
  container.innerHTML += html
}

export function drawBestSkillsDetails(skillsArray) {
  const totalValue = skillsArray.reduce((sum, [_, val]) => sum + val, 0)
  
  let html = '<div class="best-skills-details">'
  
  skillsArray.forEach(([skill, value], index) => {
    const percentage = ((value / totalValue) * 100).toFixed(1)
    const displayValue = (value / 1000).toFixed(1)
    
    
    let level = "Beginner"
    let levelColor = "#f59e0b"
    if (percentage > 25) {
      level = "Expert"
      levelColor = "#22c55e"
    } else if (percentage > 15) {
      level = "Advanced"
      levelColor = "#3b82f6"
    } else if (percentage > 10) {
      level = "Intermediate"
      levelColor = "#8b5cf6"
    }
    
    html += `
      <div class="best-skill-item">
        <div class="skill-rank">#${index + 1}</div>
        <div class="skill-content">
          <div class="skill-header-row">
            <span class="skill-name">${skill}</span>
            <span class="skill-level" style="color: ${levelColor}">${level}</span>
          </div>
          <div class="skill-stats">
            <span class="skill-value">${displayValue} kB earned</span>
            <span class="skill-percentage">${percentage}% of total</span>
          </div>
          <div class="skill-bar-wrapper-best">
            <div class="skill-bar-best" style="width: ${percentage}%; background: linear-gradient(90deg, ${levelColor}, ${levelColor}dd)"></div>
          </div>
        </div>
      </div>
    `
  })
  
  html += '</div>'
  
  const container = document.getElementById("bestSkillsGraph")
  container.innerHTML += html
}
