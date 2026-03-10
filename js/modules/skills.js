// Skills Module
import { fetchSkillsData } from '../api.js'
import { drawRadarChart } from '../charts.js'

export async function loadBestSkills() {
  const data = await fetchSkillsData()

  const skillsData = {}
  
  // Skill transactions store the current skill level (0–100), not a delta.
  // Keep only the highest recorded amount per skill.
  data.transaction.forEach(t => {
    const skillName = t.type.replace("skill_", "")
    if (!skillsData[skillName] || t.amount > skillsData[skillName]) {
      skillsData[skillName] = t.amount
    }
  })

  // Get top 6 skills
  const topSkills = Object.entries(skillsData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const skillsForRadar = topSkills.reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})

  drawRadarChart(skillsForRadar, "bestSkillsGraph", "#4facfe")
}
