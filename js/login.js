if (localStorage.getItem("token")) {
  window.location.href = "profile.html"
}

const form = document.getElementById("loginForm")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const identifier = document.getElementById("identifier").value.trim()
  const password = document.getElementById("password").value
  const errorEl = document.getElementById("error")
  errorEl.textContent = ""

  const credentials = btoa(`${identifier}:${password}`)

  try {

    const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
      method: "POST",
      headers: {
        Authorization: "Basic " + credentials
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid credentials. Please check your username/email and password.")
      }
      throw new Error(`Login failed (${response.status}). Please try again.`)
    }

    const token = await response.json()

    localStorage.setItem("token", token)

    window.location.href = "profile.html"

  } catch (error) {
    errorEl.textContent = error.message.includes("Failed to fetch")
      ? "Network error. Please check your connection."
      : error.message
  }

})