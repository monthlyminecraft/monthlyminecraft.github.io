// reward pool with rarity chances
const rewardPool = [
  { name: "Top Hat", rarity: "common", chance: 60 },
  { name: "Wave Emote", rarity: "rare", chance: 25 },
  { name: "Creeper Pet", rarity: "epic", chance: 10 },
  { name: "Dragon Mount", rarity: "legendary", chance: 5 }
];

const itemsContainer = document.getElementById("items");
const resultText = document.getElementById("result");

const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

let spinning = false;

function weightedRoll() {
  const total = rewardPool.reduce((sum,r)=>sum+r.chance,0);
  let roll = Math.random()*total;

  for (let reward of rewardPool) {
    if (roll < reward.chance) return reward;
    roll -= reward.chance;
  }
}

// build spinner items
function populateSpinner() {

  itemsContainer.innerHTML = "";

  for (let i=0;i<70;i++) {

    const reward = rewardPool[Math.floor(Math.random()*rewardPool.length)];

    const div = document.createElement("div");
    div.classList.add("item", reward.rarity);
    div.textContent = reward.name;

    itemsContainer.appendChild(div);
  }

}

// crate open logic
function openCrate() {

  if (spinning) return;

  spinning = true;
  resultText.textContent = "";

  spinSound.currentTime = 0;
  spinSound.play();

  populateSpinner();

  const winReward = weightedRoll();

  const items = document.querySelectorAll(".item");

  let winIndex = Math.floor(Math.random()*20)+35;

  items[winIndex].textContent = winReward.name;
  items[winIndex].className = "item " + winReward.rarity;

  const offset = (winIndex * 120) - 300;

  itemsContainer.style.transition = "transform 5s cubic-bezier(.08,.6,.2,1)";
  itemsContainer.style.transform = `translateX(-${offset}px)`;

  setTimeout(()=>{

    winSound.currentTime = 0;
    winSound.play();

    resultText.textContent = "YOU WON: " + winReward.name;

    highlightWin(items[winIndex]);

    spinning = false;

  },5000);

}

// glow effect on win
function highlightWin(item){

  item.style.boxShadow = "0 0 40px white";
  item.style.transform = "scale(1.1)";

}

// crate button
document.getElementById("crate").addEventListener("click", openCrate);

// initial spinner load
populateSpinner();
