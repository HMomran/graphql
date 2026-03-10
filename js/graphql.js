export async function graphqlRequest(query) {

  const token = localStorage.getItem("token")

  const response = await fetch(
    "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ query })
    }
  )

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "index.html"
      throw new Error("Session expired. Please log in again.")
    }
    throw new Error(`Request failed: ${response.status}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}