// Smooth Page Transitions
document.querySelectorAll('a').forEach(link=>{
  link.addEventListener('click',e=>{
    const href=link.getAttribute('href');
    if(!href.startsWith("#")){ e.preventDefault(); document.body.classList.add("fade-out");
      setTimeout(()=>{ window.location.href=href; },300);
    }
  });
});

// Layered Particles
const canvas=document.getElementById("bg");
if(canvas){
  const ctx=canvas.getContext("2d");
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize(); window.onresize=resize;

  const layers=[[],[],[]];
  const colors=["#22c55e","#16a34a","#bbf7d0"];
  for(let l=0;l<3;l++){
    for(let i=0;i<60;i++){
      layers[l].push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:2+Math.random()*4,speed:0.1+0.2*l,color:colors[l]});
    }
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    layers.forEach(layer=>{
      layer.forEach(p=>{
        ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.size,p.size);
        p.y-=p.speed; if(p.y<-p.size)p.y=canvas.height;
      });
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Fetch Server Data
async function fetchServerData(){
  try{ const res=await fetch("https://api.mcstatus.io/v2/status/java/rowbot.in"); return await res.json(); }
  catch(err){ console.error("Fetch error:",err); return null; }
}

// Update Index Analytics
async function updateAnalytics(){
  const data=await fetchServerData(); if(!data) return;
  const sv=document.getElementById("serverversion");
  const motd=document.getElementById("motd");
  const up=document.getElementById("uptime");
  const countEl=document.getElementById("playercount");
  if(countEl) countEl.innerText=`${data.players.online} / ${data.players.max} players online`;
  if(sv) sv.innerText="Version: "+(data.version.name_clean||"Unknown");
  if(motd) motd.innerText="MOTD: "+(data.motd.clean||"Unknown");
  if(up) up.innerText="Latency: "+(data.latency||"Unknown");
}

// Update Players Page
async function updatePlayers(){
  const container=document.getElementById("players");
  const countEl=document.getElementById("playercount");
  if(!container||!countEl) return; container.innerHTML="";
  const data=await fetchServerData(); if(!data){countEl.innerText="Unable to load players"; return;}
  const online=data.players.online;
  const list=data.players.list||[];
  countEl.innerText=`${online} / ${data.players.max} players online`;
  if(list.length===0){container.innerHTML="<p>No players online.</p>"; return;}
  list.forEach(p=>{
    const card=document.createElement("div");
    card.className="player"; card.innerHTML=`<img src="https://crafatar.com/renders/body/${p.username}?overlay&default=MHF_Steve" onerror="this.src='https://crafatar.com/renders/body/MHF_Steve?overlay';"><p>${p.username}</p>`;
    card.onclick=()=>openPlayerModal(p.username);
    container.appendChild(card);
  });
}

// Player Modal
function openPlayerModal(name){
  const modal=document.createElement("div");
  modal.style=`position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;justify-content:center;align-items:center;z-index:1000;`;
  modal.innerHTML=`<div style="background:#111827;padding:25px;border-radius:12px;text-align:center;max-width:320px;"><h2>${name}</h2><img src="https://crafatar.com/renders/body/${name}?overlay&default=MHF_Steve" style="width:150px;border-radius:10px;" onerror="this.src='https://crafatar.com/renders/body/MHF_Steve?overlay';"><p style="margin-top:10px;color:#aaa;">Click anywhere to close</p></div>`;
  modal.onclick=()=>document.body.removeChild(modal);
  document.body.appendChild(modal);
}

// Leaderboard Example
async function updateLeaderboard(){
  const container=document.getElementById("leaderboard");
  if(!container) return; container.innerHTML="";
  const topPlayers=[{name:"Player1",score:2500},{name:"Player2",score:2100},{name:"Player3",score:1800}];
  topPlayers.forEach(p=>{
    const div=document.createElement("div");
    div.className="leaderboard-player"; div.innerHTML=`<h3>${p.name}</h3><p>Score: ${p.score}</p>`;
    container.appendChild(div);
  });
}

// Auto-update
updateAnalytics(); updatePlayers(); updateLeaderboard();
setInterval(updateAnalytics,15000);
setInterval(updatePlayers,15000);
