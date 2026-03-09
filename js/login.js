const form = document.getElementById("loginForm")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const identifier = document.getElementById("identifier").value
  const password = document.getElementById("password").value

  const credentials = btoa(identifier + ":" + password)

  try {

    const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
      method: "POST",
      headers: {
        Authorization: "Basic " + credentials
      }
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    const token = await response.json()

    localStorage.setItem("token", token)

    window.location.href = "profile.html"

  } catch (error) {
    document.getElementById("error").textContent = "Login failed"
  }

})