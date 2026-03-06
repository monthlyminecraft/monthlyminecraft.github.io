/* =========================
SERVER STATUS + PLAYER COUNT
========================= */

const serverIP = "rowbot.in"; // change if needed
const serverPort = "25565";

const statusEl = document.getElementById("server-status");
const playersEl = document.getElementById("player-count");

async function updateServer() {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}:${serverPort}`);
    const data = await res.json();

    if (data.online) {
      statusEl.innerText = "🟢 Online";

      const online = data.players.online;
      const max = data.players.max;

      playersEl.innerText = `${online}/${max} players`;
    } else {
      statusEl.innerText = "🔴 Offline";
      playersEl.innerText = "0/0 players";
    }

  } catch (err) {
    statusEl.innerText = "⚠ Error";
    playersEl.innerText = "-";
  }
}

updateServer();
setInterval(updateServer, 2000);


/* =========================
FALLING BLOCK BACKGROUND
========================= */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const textures = [
"assets/blocks/block1.png",
"assets/blocks/block2.png",
"assets/blocks/block3.png",
"assets/blocks/block4.png"
];

const images = textures.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const blocks = [];

for (let i = 0; i < 30; i++) {
  blocks.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 0.3 + Math.random(),
    size: 40 + Math.random()*30,
    img: images[Math.floor(Math.random()*images.length)]
  });
}

function drawBlocks(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  blocks.forEach(b=>{
    b.y += b.speed;

    if(b.y > canvas.height){
      b.y = -50;
      b.x = Math.random()*canvas.width;
    }

    ctx.drawImage(b.img,b.x,b.y,b.size,b.size);
  });

  requestAnimationFrame(drawBlocks);
}

drawBlocks();


/* =========================
MOUSE PARTICLES
========================= */

const particles=[];

window.addEventListener("mousemove",(e)=>{
  particles.push({
    x:e.clientX,
    y:e.clientY,
    life:30,
    size:4+Math.random()*4
  });
});

function drawParticles(){

  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,0.7)";
    ctx.fill();

    p.life--;
    p.y-=0.3;

    if(p.life<=0) particles.splice(i,1);
  }

  requestAnimationFrame(drawParticles);
}

drawParticles();
