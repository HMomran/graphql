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
      body: JSON.stringify({
        query: query
      })
    }
  )

  const data = await response.json()

  return data.data
}