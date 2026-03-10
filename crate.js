const rewards = [

{name:"Wave Emote", rarity:"common", perm:"ultracosmetics.emote.wave", chance:30},
{name:"Dab Emote", rarity:"common", perm:"ultracosmetics.emote.dab", chance:30},

{name:"Top Hat", rarity:"common", perm:"ultracosmetics.hat.tophat", chance:25},
{name:"Cowboy Hat", rarity:"common", perm:"ultracosmetics.hat.cowboy", chance:25},

{name:"TNT Gadget", rarity:"rare", perm:"ultracosmetics.gadget.tnt", chance:15},
{name:"Bat Blaster", rarity:"rare", perm:"ultracosmetics.gadget.batblaster", chance:15},

{name:"Pig Pet", rarity:"rare", perm:"ultracosmetics.pet.pig", chance:10},
{name:"Creeper Pet", rarity:"rare", perm:"ultracosmetics.pet.creeper", chance:10},

{name:"Dragon Mount", rarity:"epic", perm:"ultracosmetics.mount.dragon", chance:3},
{name:"Enderman Morph", rarity:"epic", perm:"ultracosmetics.morph.enderman", chance:3},

{name:"Phoenix Mount", rarity:"legendary", perm:"ultracosmetics.mount.phoenix", chance:1},
{name:"Wither Morph", rarity:"legendary", perm:"ultracosmetics.morph.wither", chance:1}

];

const itemsDiv = document.getElementById("items");
const resultDiv = document.getElementById("result");

const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

let spinning = false;

function rollReward(){

let total = 0;

for(let r of rewards) total += r.chance;

let roll = Math.random() * total;

for(let r of rewards){

if(roll < r.chance) return r;

roll -= r.chance;

}

}

function buildReel(){

itemsDiv.innerHTML="";

for(let i=0;i<120;i++){

let reward = rewards[Math.floor(Math.random()*rewards.length)];

let div = document.createElement("div");

div.className = "item " + reward.rarity;

div.innerHTML = reward.name;

itemsDiv.appendChild(div);

}

}

function openCrate(){

if(spinning) return;

spinning = true;

resultDiv.innerHTML="";

spinSound.currentTime = 0;
spinSound.play();

buildReel();

const winReward = rollReward();

let items = document.querySelectorAll(".item");

let winIndex = Math.floor(Math.random()*40) + 40;

items[winIndex].innerHTML = winReward.name;
items[winIndex].className = "item " + winReward.rarity;

const offset = (winIndex * 140) - 360;

itemsDiv.style.transition = "transform 5s cubic-bezier(.1,.7,.1,1)";
itemsDiv.style.transform = "translateX(-"+offset+"px)";

setTimeout(()=>{

winSound.currentTime = 0;
winSound.play();

items[winIndex].style.boxShadow="0 0 40px white";
items[winIndex].style.transform="scale(1.1)";

resultDiv.innerHTML="YOU WON: "+winReward.name;

spinning=false;

},5000);

}

document.getElementById("crateButton").onclick=openCrate;

buildReel();;
