```javascript
const SERVER_IP = "rowbot.in:25565";

/* SERVER STATUS */

async function loadServer(){

try{

const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
const data = await res.json();

if(document.getElementById("serverStatus")){

if(data.online){

document.getElementById("serverStatus").innerText =
`${data.players.online}/${data.players.max} players online`;

}else{

document.getElementById("serverStatus").innerText =
"Server Offline";

}

}

/* PLAYERS PAGE */

if(document.getElementById("playerCount")){

document.getElementById("playerCount").innerText =
data.players ? data.players.online : 0;

const list = document.getElementById("playerList");

if(list && data.players && data.players.list){

list.innerHTML="";

data.players.list.forEach(p=>{

const card=document.createElement("div");
card.className="player-card";

card.innerHTML=
`<img src="https://mc-heads.net/avatar/${p}/100">
<p>${p}</p>`;

list.appendChild(card);

});

}

}

/* LEADERBOARD */

if(document.getElementById("leaderboard") && data.players && data.players.list){

const board=document.getElementById("leaderboard");

board.innerHTML="";

data.players.list.forEach((p,i)=>{

const row=document.createElement("div");

row.innerHTML=`${i+1}. ${p}`;

board.appendChild(row);

});

}

}catch(e){
console.log(e);
}

}

loadServer();
setInterval(loadServer,30000);


/* PARTICLES */

const canvas=document.getElementById("particles");
if(canvas){

const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];

for(let i=0;i<80;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:4,
speed:0.5+Math.random()
});
}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{

ctx.fillStyle="cyan";
ctx.fillRect(p.x,p.y,p.size,p.size);

p.y+=p.speed;

if(p.y>canvas.height)p.y=0;

});

requestAnimationFrame(animate);

}

animate();

}
```
