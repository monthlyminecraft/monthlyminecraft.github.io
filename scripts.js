/* =========================
   CANVAS SETUP
========================= */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =========================
   MOUSE PARTICLES
========================= */
let mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const particles = [];
function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
    p.life--;
    p.y -= 0.3;
    if (p.life <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(drawParticles);
}
window.addEventListener("mousemove", e => {
  particles.push({
    x: e.clientX,
    y: e.clientY,
    life: 30,
    size: 4 + Math.random() * 4
  });
});
drawParticles();

/* =========================
   FALLING BLOCKS
========================= */
const textures = [
  "assets/blocks/block1.png",
  "assets/blocks/block2.png",
  "assets/blocks/block3.png",
  "assets/blocks/block4.png"
];
const images = textures.map(src => { const img = new Image(); img.src = src; return img; });

const blocks = [];
for (let i = 0; i < 30; i++) {
  blocks.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 40 + Math.random() * 30,
    speed: 0.3 + Math.random(),
    img: images[Math.floor(Math.random() * images.length)]
  });
}

function drawBlocks() {
  // Fill canvas with black every frame
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  blocks.forEach(b => {
    b.y += b.speed;
    if (b.y > canvas.height) {
      b.y = -50;
      b.x = Math.random() * canvas.width;
    }
    ctx.drawImage(b.img, b.x, b.y, b.size, b.size);
  });

  requestAnimationFrame(drawBlocks);
}
drawBlocks();

/* =========================
   SERVER STATUS
========================= */
const serverIP = "rowbot.in"; // Your server IP
const serverPort = "25565";

const statusEl = document.getElementById("server-status");
const playersEl = document.getElementById("player-count");
const playerListEl = document.getElementById("player-list");

async function updateServer() {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}:${serverPort}`);
    const data = await res.json();

    if (data.online) {
      statusEl.innerText = "🟢 Server Online";

      const online = data.players?.online ?? 0;
      const max = data.players?.max ?? 0;
      playersEl.innerText = `${online} / ${max} players`;

      // Clear previous list
      playerListEl.innerHTML = "";

      if (data.players.list && data.players.list.length > 0) {
        // For each UUID, fetch the player name from Mojang
        for (const player of data.players.list) {
          let playerName = player.name; // fallback if no UUID
          if (player.uuid) {
            try {
              const nameRes = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${player.uuid}`);
              const profile = await nameRes.json();
              playerName = profile.name;
            } catch(e) {
              // fallback
            }
          }

          const li = document.createElement("li");
          li.innerText = playerName;
          playerListEl.appendChild(li);
        }
      }

    } else {
      statusEl.innerText = "🔴 Server Offline";
      playersEl.innerText = "0 / 0 players";
      playerListEl.innerHTML = "";
    }
  } catch (err) {
    statusEl.innerText = "⚠ Error";
    playersEl.innerText = "-";
    playerListEl.innerHTML = "";
  }
}

// Update every 2 seconds
updateServer();
setInterval(updateServer, 2000);
