// Authentication Management
export function checkAuth() {
  const token = localStorage.getItem("token")
  
  if (!token) {
    window.location.href = "index.html"
    return false
  }
  
  return true
}

export function setupLogout() {
  const logout = document.getElementById("logout")
  
  logout.addEventListener("click", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("selectedEventId")
    window.location.href = "index.html"
  })
}
