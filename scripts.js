const serverIP = "rowbot.in";
const serverPort = 25565;

// Canvas
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// UI
const statusEl = document.getElementById("status");
const playersEl = document.getElementById("players");
const playerListEl = document.getElementById("player-list");

// Blocks
const blocks = [];
const blockCount = 5;
for(let i=1;i<=blockCount;i++){
    const img = new Image();
    img.src = `assets/blocks/block${i}.png`;
    blocks.push({
        img,
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        size: 50,
        speed: Math.random()*1.5+0.5,
        loaded:false
    });
    img.onload = () => blocks[i-1].loaded = true;
}

// Particles
const particles = [];
const particleCount = 50;
for(let i=0;i<particleCount;i++){
    particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        size: Math.random()*4+2,
        speedX: (Math.random()-0.5)*1,
        speedY: (Math.random()-0.5)*1
    });
}

// Mouse tracking
let mouse = {x:canvas.width/2,y:canvas.height/2};
window.addEventListener("mousemove", e => {mouse.x=e.clientX; mouse.y=e.clientY;});

// Draw loop
function draw(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Blocks
    blocks.forEach(b=>{
        if(!b.loaded) return;
        b.y += b.speed;
        if(b.y>canvas.height) b.y=-50;
        ctx.drawImage(b.img,b.x,b.y,b.size,b.size);
    });

    // Particles
    particles.forEach(p=>{
        p.x += p.speedX + (mouse.x-p.x)*0.002;
        p.y += p.speedY + (mouse.y-p.y)*0.002;
        if(p.x<0)p.x=canvas.width;
        if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height;
        if(p.y>canvas.height)p.y=0;

        ctx.fillStyle="rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fill();
    });

    requestAnimationFrame(draw);
}
draw();

// Server status
async function updateServer(){
    try{
        const res = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}:${serverPort}`);
        const data = await res.json();

        if(data.online){
            statusEl.innerText="🟢 Server Online";
            const online = data.players?.online ?? 0;
            const max = data.players?.max ?? 0;
            playersEl.innerText=`${online} / ${max} players`;

            playerListEl.innerHTML="";
            if(data.players.list && data.players.list.length > 0){
                data.players.list.forEach(name=>{
                    // UUID fallback
                    const uuid = (data.players.uuid && data.players.uuid[name]) ? data.players.uuid[name] : "unknown";
                    const li = document.createElement("li");
                    li.innerText=uuid;
                    playerListEl.appendChild(li);
                });
            }
        }else{
            statusEl.innerText="🔴 Server Offline";
            playersEl.innerText="0 / 0 players";
            playerListEl.innerHTML="";
        }
    }catch(err){
        statusEl.innerText="⚠ Error";
        playersEl.innerText="-";
        playerListEl.innerHTML="";
        console.error(err);
    }
}

// Initial + repeat every 2s
updateServer();
setInterval(updateServer,2000);

// Resize handling
window.addEventListener("resize",()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});
