const SERVER = "rowbot.in:25565";

async function loadServer(){

try{

const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER}`);
const data = await res.json();

/* HOMEPAGE STATS */

if(document.getElementById("status")){

document.getElementById("status").innerText =
data.online ? "Online" : "Offline";

document.getElementById("players").innerText =
data.players ? data.players.online : 0;

document.getElementById("max").innerText =
data.players ? data.players.max : 0;

}

/* LEADERBOARD */

if(document.getElementById("leaderboard")){

const board = document.getElementById("leaderboard");
board.innerHTML="";

if(data.players && data.players.list){

data.players.list.forEach((p,i)=>{

const row=document.createElement("div");
row.className="row";

row.innerHTML = `
<span>#${i+1}</span>
<span>${p}</span>
`;

board.appendChild(row);

});

}else{

board.innerHTML =
"<p>No player leaderboard available.</p>";

}

}

}catch(e){
console.log(e);
}

}

loadServer();
setInterval(loadServer,30000);
