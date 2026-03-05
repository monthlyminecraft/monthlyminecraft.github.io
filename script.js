// ---------------- Animated Background ----------------
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.onresize = resize;

const particles = [];
for(let i=0;i<100;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    size: 2 + Math.random()*3,
    speed: 0.2 + Math.random()*0.5
  });
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#22c55e";
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
    p.y -= p.speed;
    if(p.y < 0) p.y = canvas.height;
  });
  requestAnimationFrame(animate);
}

animate();

// ---------------- Server IP Copy ----------------
function copyIP(){
  navigator.clipboard.writeText("rowbot.in:25565");
  alert("Server IP copied!");
}

// ---------------- Live Player List + Analytics ----------------
function updatePlayers(){
  const container = document.getElementById("players");
  container.innerHTML = "";
  fetch("https://api.mcsrvstat.us/2/rowbot.in:25565")
  .then(r=>r.json())
  .then(data=>{
    document.getElementById("playercount").innerText = data.players.online + " / " + data.players.max + " players online";

    // Player skins
    if(data.players.list){
      data.players.list.forEach(name=>{
        const p = document.createElement("div");
        p.className = "player";
        p.innerHTML = `<img src="https://crafatar.com/renders/body/${name}?overlay"><p>${name}</p>`;
        container.appendChild(p);
      });
    }

    // Analytics
    document.getElementById("serverversion").innerText = "Version: " + (data.version || "Unknown");
    document.getElementById("motd").innerText = "MOTD: " + (data.motd?.clean?.join(" ") || "Unknown");
    document.getElementById("uptime").innerText = "Players Online: " + data.players.online;
  });
}

// Initial load
updatePlayers();
setInterval(updatePlayers,15000);
