
import { fetchUser } from '../api.js'

export async function loadUser() {
  const user = await fetchUser()

  
  document.getElementById("profileInfo").innerHTML = `
    <div class="profile-info-list">
      <div class="profile-info-row">
        <span class="info-label">Username</span>
        <span class="info-value">${user.login}</span>
      </div>
      <div class="profile-info-row">
        <span class="info-label">User ID</span>
        <span class="info-value">#${user.id}</span>
      </div>
    </div>
  `
}
