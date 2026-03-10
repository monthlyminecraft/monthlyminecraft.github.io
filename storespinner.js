// ==== REWARD POOL ====
const rewards = [
  {name:"Wave Emote", rarity:"common", perm:"ultracosmetics.emote.wave", chance:30},
  {name:"Dab Emote", rarity:"common", perm:"ultracosmetics.emote.dab", chance:30},
  {name:"Top Hat", rarity:"common", perm:"ultracosmetics.hat.tophat", chance:25},
  {name:"Cowboy Hat", rarity:"common", perm:"ultracosmetics.hat.cowboy", chance:25},
  {name:"TNT Gadget", rarity:"rare", perm:"ultracosmetics.gadget.tnt", chance:15},
  {name:"Bat Blaster", rarity:"rare", perm:"ultracosmetics.gadget.batblaster", chance:15},
  {name:"Creeper Pet", rarity:"rare", perm:"ultracosmetics.pet.creeper", chance:10},
  {name:"Dragon Mount", rarity:"epic", perm:"ultracosmetics.mount.dragon", chance:3},
  {name:"Phoenix Mount", rarity:"legendary", perm:"ultracosmetics.mount.phoenix", chance:1},
];

const spinner = document.getElementById("spinner");
const resultDiv = document.getElementById("result");
const crateButton = document.getElementById("crateButton");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");
const confettiSound = document.getElementById("confettiSound");
const inventoryBox = document.getElementById("inventoryBox");

let spinning = false;

// Load inventory from localStorage
let inventory = JSON.parse(localStorage.getItem("cosmeticInventory") || "[]");
renderInventory();

// ==== Weighted reward roll ====
function rollReward() {
  const total = rewards.reduce((sum,r)=>sum+r.chance,0);
  let roll = Math.random()*total;
  for (let r of rewards) {
    if (roll < r.chance) return r;
    roll -= r.chance;
  }
}

// ==== Build spinner slots ====
function buildSpinner() {
  spinner.innerHTML = "";
  for(let i=0;i<60;i++) {
    const r = rewards[Math.floor(Math.random()*rewards.length)];
    const slot = document.createElement("div");
    slot.className = "slot "+r.rarity;
    slot.innerText = r.name;
    spinner.appendChild(slot);
  }
}

// ==== Spin animation ====
function spin(reward) {
  const slots = document.querySelectorAll(".slot");
  const winIndex = Math.floor(Math.random()*10)+25; // stop in middle

  slots[winIndex].innerText = reward.name;
  slots[winIndex].className = "slot "+reward.rarity;

  const totalMove = winIndex*148; // slot width + margin
  spinner.style.transition = "transform 5s cubic-bezier(.1,.7,.1,1)";
  spinner.style.transform = `translateX(-${totalMove}px)`;

  setTimeout(()=> {
    winSound.currentTime = 0;
    winSound.play();

    slots[winIndex].style.boxShadow="0 0 40px white";
    slots[winIndex].style.transform="scale(1.1)";
    resultDiv.innerText = `YOU WON: ${reward.name}`;

    // Add to inventory
    inventory.push(reward);
    localStorage.setItem("cosmeticInventory", JSON.stringify(inventory));
    renderInventory();

    // Confetti for rare/epic/legendary
    if(["epic","legendary"].includes(reward.rarity)) {
      confettiSound.currentTime = 0;
      confettiSound.play();
      alert("🎉 " + reward.rarity.toUpperCase() + " DROP! 🎉");
    }

    spinning = false;
  },5000);
}

function renderInventory() {
  inventoryBox.innerHTML = "";
  for(let item of inventory) {
    const div = document.createElement("div");
    div.className = "inventorySlot "+item.rarity;
    div.innerText = item.name;
    inventoryBox.appendChild(div);
  }
}

function openCrate() {
  if(spinning) return;
  spinning = true;
  resultDiv.innerText = "";
  spinSound.currentTime = 0;
  spinSound.play();
  buildSpinner();
  const reward = rollReward();
  spin(reward);
}

crateButton.addEventListener("click", openCrate);
buildSpinner();
