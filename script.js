const SERVER_IP = "rowbot.in";

// ---------------- PARTICLE BACKGROUND ----------------
const canvas = document.getElementById("bg");

if (canvas) {
const ctx = canvas.getContext("2d");

function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resize();
window.onresize = resize;

const particles = [];

for(let i=0;i<120;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:2+Math.random()*4,
speed:0.2+Math.random()*0.6
});
}

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{
ctx.fillStyle="#22c55e";
ctx.fillRect(p.x,p.y,p.size,p.size);

p.y-=p.speed;

if(p.y<0){
p.y=canvas.height;
p.x=Math.random()*canvas.width;
}
});

requestAnimationFrame(animate);
}

animate();
}

// ---------------- FETCH SERVER DATA ----------------
async function fetchServer(){

try{

const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_IP}`);
const data = await res.json();

return data;

}catch(err){

console.error("Server fetch failed",err);

return {
players:{online:0,max:0,list:[]}
};

}

}

// ---------------- ANALYTICS ----------------
async function updateAnalytics(){

const data = await fetchServer();

const count = document.getElementById("playercount");
const version = document.getElementById("serverversion");
const motd = document.getElementById("motd");
const latency = document.getElementById("uptime");

if(count){
count.innerText = `${data.players.online} / ${data.players.max} players online`;
}

if(version && data.version){
version.innerText = `Version: ${data.version.name_clean}`;
}

if(motd && data.motd){
motd.innerText = `MOTD: ${data.motd.clean}`;
}

if(latency){
latency.innerText = `Latency: ${data.latency}ms`;
}

}

// ---------------- PLAYER TAB ----------------
async function updatePlayers(){

const grid = document.getElementById("players");
const count = document.getElementById("playercount");

if(!grid) return;

grid.innerHTML = "";

const data = await fetchServer();

count.innerText = `${data.players.online} / ${data.players.max} players online`;

let players = [];

if(data.players.list){

players = data.players.list.map(p=>{
if(typeof p === "string"){
return p;
}
return p.name || p.username;
});

}

// if server hides player names
if(players.length === 0){

if(data.players.online === 0){

grid.innerHTML = "<p>No players online</p>";
return;

}

// show placeholder cards
for(let i=0;i<data.players.online;i++){

createPlayerCard("Player");

}

return;

}

players.forEach(name=>{

createPlayerCard(name);

});

}

// ---------------- PLAYER CARD ----------------
function createPlayerCard(name){

const grid = document.getElementById("players");

const card = document.createElement("div");
card.className="player";

card.innerHTML = `
<img src="https://mc-heads.net/body/${name}/right">
<p>${name}</p>
`;

card.onclick=()=>openPlayer(name);

grid.appendChild(card);

}

// ---------------- PLAYER MODAL ----------------
function openPlayer(name){

const modal = document.createElement("div");

modal.style=`
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.9);
display:flex;
justify-content:center;
align-items:center;
z-index:999;
`;

modal.innerHTML=`
<div style="background:#111827;padding:30px;border-radius:12px;text-align:center">
<h2>${name}</h2>
<img src="https://mc-heads.net/body/${name}" style="width:180px">
<p>Click anywhere to close</p>
</div>
`;

modal.onclick=()=>modal.remove();

document.body.appendChild(modal);

}

// ---------------- LEADERBOARD ----------------
async function updateLeaderboard(){

const board = document.getElementById("leaderboard");

if(!board) return;

board.innerHTML="";

const data = await fetchServer();

let players=[];

if(data.players.list){

players = data.players.list.map(p=>{
if(typeof p==="string") return p;
return p.name || p.username;
});

}

// sort alphabetically (placeholder ranking)
players.sort();

if(players.length===0){

board.innerHTML="<p>No ranked players online</p>";
return;

}

players.forEach((name,index)=>{

const row = document.createElement("div");

row.className="leaderboard-player";

row.innerHTML=`
<h3>#${index+1}</h3>
<img src="https://mc-heads.net/head/${name}">
<p>${name}</p>
`;

board.appendChild(row);

});

}

// ---------------- AUTO UPDATE ----------------

updateAnalytics();
updatePlayers();
updateLeaderboard();

setInterval(updateAnalytics,15000);
setInterval(updatePlayers,15000);
setInterval(updateLeaderboard,15000);
