const SERVER = "rowbot.in:25565";

async function loadServer(){

try{

const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER}`);
const data = await res.json();

/* PLAYER COUNT */

const countEl = document.getElementById("playerCount");

if(countEl){

if(data.online){

countEl.textContent =
`${data.players.online} / ${data.players.max} players online`;

}else{

countEl.textContent = "Server Offline";

}

}

/* PLAYER LIST */

const list = document.getElementById("playerList");

if(list){

list.innerHTML="";

if(data.players && data.players.list){

data.players.list.forEach(name=>{

const card=document.createElement("div");
card.className="player-card";

card.innerHTML=
`
<img src="https://mc-heads.net/avatar/${name}/100">
<p>${name}</p>
`;

list.appendChild(card);

});

}else{

list.innerHTML =
"<p style='opacity:0.7'>Player names are hidden by the server.</p>";

}

}

}catch(err){

console.log(err);

}

}

loadServer();
setInterval(loadServer,30000);
