const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize",resizeCanvas);

let mouse = {x:null,y:null};

window.addEventListener("mousemove",e=>{
mouse.x=e.clientX;
mouse.y=e.clientY;
});

window.addEventListener("mouseleave",()=>{
mouse.x=null;
mouse.y=null;
});

const particles=[];
const blocks=[];

/* ------------------------------
LOAD BLOCK IMAGES
------------------------------ */

const blockImages=[];
const BLOCK_COUNT=5; // number of textures you have

for(let i=1;i<=BLOCK_COUNT;i++){
let img=new Image();
img.src=`assets/blocks/block${i}.png`;
blockImages.push(img);
}

/* ------------------------------
CREATE PARTICLES
------------------------------ */

for(let i=0;i<120;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*3+1,
speedY:Math.random()*0.4+0.2
});
}

/* ------------------------------
CREATE FLOATING BLOCKS
------------------------------ */

for(let i=0;i<35;i++){

let randomTexture=blockImages[Math.floor(Math.random()*blockImages.length)];

blocks.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:40+Math.random()*30,
speed:Math.random()*0.6+0.2,
rotation:Math.random()*360,
img:randomTexture
});

}

/* ------------------------------
DRAW LOOP
------------------------------ */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* floating minecraft blocks */

blocks.forEach(b=>{

b.y+=b.speed;
b.rotation+=0.2;

if(b.y>canvas.height){
b.y=-60;
b.x=Math.random()*canvas.width;
}

ctx.save();

ctx.translate(b.x,b.y);
ctx.rotate(b.rotation*Math.PI/180);

ctx.drawImage(
b.img,
-b.size/2,
-b.size/2,
b.size,
b.size
);

ctx.restore();

});

/* particles */

particles.forEach(p=>{

p.y-=p.speedY;

if(p.y<0)p.y=canvas.height;

if(mouse.x && mouse.y){

const dx=mouse.x-p.x;
const dy=mouse.y-p.y;
const dist=Math.sqrt(dx*dx+dy*dy);

if(dist<120){
p.x+=dx*0.002;
p.y+=dy*0.002;
}

}

ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fillStyle="red";
ctx.fill();

});

requestAnimationFrame(draw);

}

draw();

/* ------------------------------
SERVER STATUS
------------------------------ */

const SERVER_IP="rowbot.in";

async function getServerStatus(){

try{

const url="https://api.mcsrvstat.us/2/"+SERVER_IP;
const proxy="https://corsproxy.io/?"+encodeURIComponent(url);

const res=await fetch(proxy);
const data=await res.json();

const el=document.getElementById("players");

if(data.online){
el.textContent=data.players.online+"/"+data.players.max;
}else{
el.textContent="Offline";
}

}catch(e){
console.log(e);
}

}

getServerStatus();
setInterval(getServerStatus,10000);

/* remove loading text */

const loading=document.getElementById("loading");
if(loading) loading.style.display="none";
const iconEl = document.getElementById("server-icon");

if (data.icon) {
  iconEl.src = data.icon;
}
