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
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

// Create square "Minecraft block" particles
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
    ctx.fillRect(p.x, p.y, p.size, p.size); // squares
    p.y -= p.speed;
    if(p.y < -p.size) p.y = canvas.height;
  });
  requestAnimationFrame(animate);
}
animate();

// ---------------- Server IP Copy ----------------
function copyIP() {
  navigator.clipboard.writeText("rowbot.in:25565");
  alert("Server IP copied!");
}

// ---------------- Live Player List + Analytics ----------------
function updatePlayers() {
  const container = document.getElementById("players");
  if(!container) return;
  container.innerHTML = "";

  fetch("https://api.mcsrvstat.us/2/rowbot.in:25565")
    .then(r => r.json())
    .then(data => {
      document.getElementById("playercount").innerText =
        data.players.online + " / " + data.players.max + " players online";

      // Player skins with fallback
      if(data.players.list){
        data.players.list.forEach(name=>{
          const card = document.createElement("div");
          card.className = "player";
          card.innerHTML = `
            <img src="https://crafatar.com/renders/body/${name}?overlay&default=MHF_Steve">
            <p>${name}</p>
          `;
          // Clickable modal
          card.onclick = ()=>openPlayerModal(name);
          container.appendChild(card);
        });
      }

      // Server analytics
      document.getElementById("serverversion").innerText =
        "Version: " + (data.version || "Unknown");
      document.getElementById("motd").innerText =
        "MOTD: " + (data.motd?.clean?.join(" ") || "Unknown");
      document.getElementById("uptime").innerText =
        "Players Online: " + data.players.online;
    });
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
      <img src="https://crafatar.com/renders/body/${name}?overlay&default=MHF_Steve" style="width:150px;border-radius:10px;">
      <p style="margin-top:10px;color:#aaa;">Click anywhere to close</p>
    </div>
  `;
  modal.onclick = ()=>document.body.removeChild(modal);
  document.body.appendChild(modal);
}

// Initial load
updatePlayers();
setInterval(updatePlayers, 15000);
