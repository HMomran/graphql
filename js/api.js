
import { graphqlRequest } from './graphql.js'

export async function fetchUser() {
  const query = `
  {
    user {
      id
      login
    }
  }
  `

  const data = await graphqlRequest(query)
  return data.user[0]
}

export async function fetchAuditData() {
  const query = `
  {
    transaction(where: {type: {_in: ["up", "down"]}}) {
      type
      amount
    }
  }
  `

  return await graphqlRequest(query)
}

export async function fetchXPData(selectedEventId) {
  const whereClause = selectedEventId 
    ? `where: {type: {_eq: "xp"}, eventId: {_eq: ${selectedEventId}}}`
    : `where: {type: {_eq: "xp"}}`

  const query = `
  {
    transaction(${whereClause}) {
      eventId
      path
      amount
      createdAt
    }
  }
  `

  return await graphqlRequest(query)
}

export async function fetchSkillsData() {
  const query = `
  {
    transaction(where: {type: {_like: "skill_%"}}) {
      type
      amount
    }
  }
  `

  return await graphqlRequest(query)
}

export async function fetchModulesData() {
  const query = `
  {
    transaction(where: {type: {_eq: "xp"}}) {
      eventId
      amount
      createdAt
      event {
        object {
          name
        }
      }
    }
  }
  `

  return await graphqlRequest(query)
}

export async function fetchRecentActivity(selectedEventId, limit = 4) {
  const query = `
  {
    transaction(where: {type: {_eq: "xp"}, eventId: {_eq: ${selectedEventId}}}, order_by: {createdAt: desc}, limit: ${limit}) {
      amount
      path
      createdAt
    }
  }
  `

  return await graphqlRequest(query)
}

export async function fetchAllProjects(selectedEventId) {
  const query = `
  {
    transaction(where: {type: {_eq: "xp"}, eventId: {_eq: ${selectedEventId}}}, order_by: {createdAt: desc}) {
      amount
      path
      createdAt
    }
  }
  `

  return await graphqlRequest(query)
}

