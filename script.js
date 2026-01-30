const searchBtn = document.getElementById('searchBtn');
const input = document.getElementById('usernameInput');
const profile = document.getElementById('profile');
const reposDiv = document.getElementById('repos');
const repoList = document.getElementById('repoList');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function fetchUser(u) {
  loading.classList.remove('hidden');
  error.classList.add('hidden');
  try {
    const res = await fetch(`https://api.github.com/users/${u}`);
    if (!res.ok) throw Error();
    const data = await res.json();
    profile.innerHTML = `<img src="${data.avatar_url}">
  <div class="profile-info">
    <div class="profile-header">
        <h2>${data.name || data.login}</h2>
        <p>Joined ${formatDate(data.created_at)}</p>
    </div>
    <p class="profile-bio">${data.bio || 'This profile has no bio'}</p>
    <a class="profile-link" href="${data.html_url}" target="_blank">View Profile</a>
  </div>`;
    profile.classList.remove('hidden');
    const repos = await fetch(data.repos_url).then(r => r.json());
    repoList.innerHTML = '';
    repos.slice(0, 5).forEach(r => {
      repoList.innerHTML += `<li><a href="${r.html_url}" target="_blank">${r.name}</a></li>`;
    });
    reposDiv.classList.remove('hidden');
  } catch {
    error.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
  }
}

searchBtn.onclick = () => input.value && fetchUser(input.value);

document.getElementById('battleBtn').onclick = async () => {
  const u1 = user1.value, u2 = user2.value;
  if (!u1 || !u2) return;
  const [a, b] = await Promise.all([
    fetch(`https://api.github.com/users/${u1}`).then(r => r.json()),
    fetch(`https://api.github.com/users/${u2}`).then(r => r.json())
  ]);
  battleResult.innerHTML = a.followers > b.followers ?
    `<p class="winner">${u1} Wins</p><p class="loser">${u2} Loses</p>` :
    `<p class="winner">${u2} Wins</p><p class="loser">${u1} Loses</p>`;
}
