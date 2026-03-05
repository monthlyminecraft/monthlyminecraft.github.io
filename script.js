// ---------------- Smooth Page Transitions ----------------
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href.startsWith("#")) {
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(() => { window.location.href = href; }, 300);
    }
  });
});

// ---------------- Animated Particle Background ----------------
const canvas = document.getElementById("bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.onresize = resize;

  const particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      size: 6 + Math.random()*4,
      speed: 0.2 + Math.random()*0.5,
      color: "#22c55e"
    });
  }

  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y -= p.speed;
      if (p.y < -p.size) p.y = canvas.height;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ---------------- Fetch Minecraft Server Info ----------------
async function fetchServerData() {
  try {
    const res = await fetch("https://api.mcstatus.io/v2/status/java/rowbot.in");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch server status:", err);
    return null;
  }
}

// ---------------- Update Index Page Analytics ----------------
async function updateAnalytics() {
  const data = await fetchServerData();
  if (!data) return;

  const sv = document.getElementById("serverversion");
  const motd = document.getElementById("motd");
  const up = document.getElementById("uptime");
  const countEl = document.getElementById("playercount");

  if (countEl) countEl.innerText = `${data.players.online} / ${data.players.max} players online`;
  if (sv) sv.innerText = "Version: " + (data.version.name_clean || "Unknown");
  if (motd) motd.innerText = "MOTD: " + (data.motd.clean || "Unknown");
  if (up) up.innerText = "Latency: " + (data.latency || "Unknown");
}

// ---------------- Update Players Page ----------------
async function updatePlayers() {
  const container = document.getElementById("players");
  const countEl = document.getElementById("playercount");
  if (!container || !countEl) return;

  container.innerHTML = "";
  const data = await fetchServerData();
  if (!data) {
    countEl.innerText = "Unable to load players";
    return;
  }

  const online = data.players.online;
  const list = data.players.list || [];

  countEl.innerText = `${online} / ${data.players.max} players online`;

  if (list.length === 0) {
    container.innerHTML = "<p>No players online.</p>";
    return;
  }

  list.forEach(player => {
    const card = document.createElement("div");
    card.className = "player";
    card.innerHTML = `
      <img src="https://crafatar.com/renders/body/${player.username}?overlay&default=MHF_Steve"
           onerror="this.src='https://crafatar.com/renders/body/MHF_Steve?overlay';">
      <p>${player.username}</p>
    `;
    card.onclick = () => openPlayerModal(player.username);
    container.appendChild(card);
  });
}

// ---------------- Player Modal ----------------
function openPlayerModal(name) {
  const modal = document.createElement("div");
  modal.style = `
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    background:rgba(0,0,0,0.85);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:1000;
  `;
  modal.innerHTML = `
    <div style="background:#111827;padding:25px;border-radius:12px;text-align:center;max-width:320px;">
      <h2>${name}</h2>
      <img src="https://crafatar.com/renders/body/${name}?overlay&default=MHF_Steve"
           style="width:150px;border-radius:10px;"
           onerror="this.src='https://crafatar.com/renders/body/MHF_Steve?overlay';">
      <p style="margin-top:10px;color:#aaa;">Click anywhere to close</p>
    </div>
  `;
  modal.onclick = () => document.body.removeChild(modal);
  document.body.appendChild(modal);
}

// ---------------- Auto Update ----------------
updateAnalytics();
updatePlayers();
setInterval(updateAnalytics, 15000);
setInterval(updatePlayers, 15000);
