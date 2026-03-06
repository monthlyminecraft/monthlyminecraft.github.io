/* =========================
   CANVAS SETUP
========================= */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


/* =========================
   MOUSE
========================= */

let mouse = {
  x: canvas.width/2,
  y: canvas.height/2
};

window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});


/* =========================
   PARTICLES
========================= */

class Particle{
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.size = Math.random()*3+1;
    this.vx = Math.random()-0.5;
    this.vy = Math.random()-0.5;
  }

  update(){
    this.x += this.vx;
    this.y += this.vy;

    let dx = mouse.x-this.x;
    let dy = mouse.y-this.y;
    let dist = Math.sqrt(dx*dx+dy*dy);

    if(dist < 120){
      this.x -= dx/20;
      this.y -= dy/20;
    }
  }

  draw(){
    ctx.fillStyle="rgba(100,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
  }
}

const particles=[];

for(let i=0;i<100;i++){
  particles.push(new Particle());
}


/* =========================
   FALLING BLOCKS
========================= */

const blockImages = [
  "https://textures.minecraft.net/texture/5e7d1c5f8d6a2c0baf9d4e6e2c8a3f4d9b6b8c7a1f0d5e3c2b1a9f8e7d6c5b4",
  "https://textures.minecraft.net/texture/1e2a4b6c8d9f0a1b2c3d4e5f67890123456789abcdefabcdefabcdefabcdefab",
  "https://textures.minecraft.net/texture/9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b123456789abcdefabcdefab"
];

class Block{
  constructor(){
    this.x=Math.random()*canvas.width;
    this.y=Math.random()*canvas.height;
    this.size=40;
    this.speed=Math.random()*1+0.5;
    this.img=new Image();
    this.img.src=blockImages[Math.floor(Math.random()*blockImages.length)];
  }

  update(){
    this.y+=this.speed;

    if(this.y>canvas.height){
      this.y=-50;
      this.x=Math.random()*canvas.width;
    }
  }

  draw(){
    ctx.drawImage(this.img,this.x,this.y,this.size,this.size);
  }
}

const blocks=[];

for(let i=0;i<20;i++){
  blocks.push(new Block());
}


/* =========================
   ANIMATION LOOP
========================= */

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  blocks.forEach(b=>{
    b.update();
    b.draw();
  });

  particles.forEach(p=>{
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();


/* =========================
   SERVER STATUS
========================= */

const serverIP="monthlyminecraft.ddns.net";
const serverPort="25565";

const statusEl=document.getElementById("server-status");
const playersEl=document.getElementById("player-count");

async function updateServer(){
  try{
    const res=await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}:${serverPort}`);
    const data=await res.json();

    if(data.online){
      statusEl.innerText="🟢 Server Online";
      playersEl.innerText=`${data.players.online} / ${data.players.max} players`;
    }else{
      statusEl.innerText="🔴 Server Offline";
      playersEl.innerText="0 / 0 players";
    }

  }catch(e){
    statusEl.innerText="⚠️ Error loading server";
    playersEl.innerText="-";
  }
}

updateServer();
setInterval(updateServer,3000);
