const SERVER = "rowbot.in:25565";

let chart;
let history = [];

/* SERVER DATA */

async function loadServer(){

const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER}`);
const data = await res.json();

/* STATS */

if(document.getElementById("status")){

document.getElementById("status").innerText =
data.online ? "Online" : "Offline";

document.getElementById("players").innerText =
data.players ? data.players.online : 0;

document.getElementById("max").innerText =
data.players ? data.players.max : 0;

}

/* GRAPH */

if(chart){

history.push(data.players ? data.players.online : 0);

if(history.length>20) history.shift();

chart.data.labels = history.map((_,i)=>i);
chart.data.datasets[0].data = history;

chart.update();

}

/* LEADERBOARD */

if(document.getElementById("leaderboard")){

const board=document.getElementById("leaderboard");
board.innerHTML="";

if(data.players && data.players.list){

data.players.list.forEach((p,i)=>{

const row=document.createElement("div");
row.className="row";

row.innerHTML=`<span>#${i+1}</span><span>${p}</span>`;

board.appendChild(row);

});

}else{

board.innerHTML="<p>No leaderboard available.</p>";

}

}

}

setInterval(loadServer,15000);
loadServer();

/* PLAYER GRAPH */

if(document.getElementById("playerChart")){

const ctx=document.getElementById("playerChart");

chart=new Chart(ctx,{
type:"line",
data:{
labels:[],
datasets:[{
label:"Players Online",
data:[],
borderColor:"cyan",
backgroundColor:"transparent"
}]
},
options:{
plugins:{legend:{display:false}},
scales:{y:{beginAtZero:true}}
}
});

}

/* BLOCK PARTICLES */

const canvas=document.getElementById("particles");

if(canvas){

const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let blocks=[];

for(let i=0;i<80;i++){

blocks.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:4,
speed:0.3+Math.random()
});

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

blocks.forEach(b=>{

ctx.fillStyle="cyan";
ctx.fillRect(b.x,b.y,b.size,b.size);

b.y+=b.speed;

if(b.y>canvas.height) b.y=0;

});

requestAnimationFrame(animate);

}

animate();

}

/* 3D BLOCK */

const bg = document.getElementById("bg3d");

if(bg){

const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer=new THREE.WebGLRenderer({canvas:bg,alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);

const geometry=new THREE.BoxGeometry();

const material=new THREE.MeshBasicMaterial({
color:0x00ffff,
wireframe:true
});

const cube=new THREE.Mesh(geometry,material);
scene.add(cube);

camera.position.z=3;

function animate3D(){

cube.rotation.x+=0.01;
cube.rotation.y+=0.01;

renderer.render(scene,camera);

requestAnimationFrame(animate3D);

}

animate3D();

}
