// ---------------- Smooth Page Transitions ----------------
document.querySelectorAll('a').forEach(link=>{
  link.addEventListener('click', e=>{
    const href = link.getAttribute('href');
    if(!href.startsWith("#")){
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(()=>{ window.location.href=href; },500);
    }
  });
});

// ---------------- Animated Particle Background ----------------
const canvas = document.getElementById("bg");
if(canvas){
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
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 6 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.5,
      color: "#22c55e"
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p=>{
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y -= p.speed;
      if (p.y < -p.size) p.y = canvas.height;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ---------------- Live Player List + Analytics ----------------
async function updatePlayers() {
  const container = document.getElementById("players");
  const countEl = document.getElementById("playercount");
  const sv = document.getElementById("serverversion");
  const motd = document.getElementById("motd");
  const up = document.getElementById("uptime");

  if(container) container.innerHTML = "";
  if(countEl) countEl.innerText = "Loading...";

  try {
    const res = await fetch("https://api.mcsrvstat.us/2/rowbot.in:25565");
    const data = await res.json();

    const playersOnline = data?.players?.online || 0;
    const maxPlayers = data?.players?.max || 0;
    const playerList = data?.players?.list || [];

    if(countEl) countEl.innerText = `${playersOnline} / ${maxPlayers} players online`;

    if(container && playerList.length){
      playerList.forEach(name=>{
        const card = document.createElement("div");
        card.className = "player";
        card.innerHTML = `
          <img src="https://crafatar.com/renders/body/${name}?overlay&default=MHF_Steve" 
               onerror="this.src='https://crafatar.com/renders/body/MHF_Steve?overlay';">
          <p>${name}</p>
        `;
        card.onclick = ()=>openPlayerModal(name);
        container.appendChild(card);
      });
    } else if(container){
      container.innerHTML = "<p>No players online.</p>";
    }

    if(sv) sv.innerText = "Version: " + (data?.version || "Unknown");
    if(motd) motd.innerText = "MOTD: " + ((data?.motd?.clean?.join(" ")) || "Unknown");
    if(up) up.innerText = "Players Online: " + playersOnline;

  } catch(err){
    console.error("Error fetching server data:", err);
    if(countEl) countEl.innerText = "Server offline";
    if(container) container.innerHTML = "<p>Cannot load players.</p>";
    if(sv) sv.innerText = "Version: Unknown";
    if(motd) motd.innerText = "MOTD: Unknown";
    if(up) up.innerText = "Players Online: 0";
  }
}

// ---------------- Modal for Player Profiles ----------------
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
    <div style="background:#111827;padding:25px;border-radius:12px;text-align:center;max-width:300px;">
      <h2>${name}</h2>
      <img src="https://crafatar.com/renders/body/${name}?overlay&default=MHF_Steve" 
           style="width:150px;border-radius:10px;" 
           onerror="this.src='https://crafatar.com/renders/body/MHF_Steve?overlay';">
      <p style="margin-top:10px;color:#aaa;">Click anywhere to close</p>
    </div>
  `;
  modal.onclick = ()=>document.body.removeChild(modal);
  document.body.appendChild(modal);
}

// Initial load + auto-update every 15s
updatePlayers();
setInterval(updatePlayers, 15000);
