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

const particles = [];
for(let i=0;i<120;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    size: 6 + Math.random()*4,    // bigger square blocks
    speed: 0.2 + Math.random()*0.5,
    color: "#22c55e"
  });
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x,p.y,p.size,p.size);  // square particles for block effect
    p.y -= p.speed;
    if(p.y < -p.size) p.y = canvas.height;
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
  if(container) container.innerHTML = "";
  
  fetch("https://api.mcsrvstat.us/2/rowbot.in:25565")
  .then(r=>r.json())
  .then(data=>{
    if(document.getElementById("playercount"))
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
    if(document.getElementById("serverversion"))
      document.getElementById("serverversion").innerText = "Version: " + (data.version || "Unknown");
    if(document.getElementById("motd"))
      document.getElementById("motd").innerText = "MOTD: " + (data.motd?.clean?.join(" ") || "Unknown");
    if(document.getElementById("uptime"))
      document.getElementById("uptime").innerText = "Players Online: " + data.players.online;
  });
}

// Initial load
updatePlayers();
setInterval(updatePlayers,15000);
