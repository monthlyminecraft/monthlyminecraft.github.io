const SERVER = "rowbot.in:25565";

/* ---------------- FETCH SERVER DATA ---------------- */

async function fetchServerData() {

  try {

    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER}`);
    const data = await res.json();

    const playersOnline = data?.players?.online ?? 0;
    const playersMax = data?.players?.max ?? 0;

    let playerList = [];

    if (Array.isArray(data?.players?.list)) {
      playerList = data.players.list.map(p =>
        typeof p === "string" ? p : (p.name || p.username)
      );
    }

    return {
      online: playersOnline,
      max: playersMax,
      players: playerList,
      version: data?.version?.name_clean ?? "Unknown",
      motd: Array.isArray(data?.motd?.clean)
        ? data.motd.clean.join(" ")
        : data?.motd?.clean ?? "",
      latency: data?.latency ?? "Unknown"
    };

  } catch (err) {

    console.error("Server API failed:", err);

    return {
      online: 0,
      max: 0,
      players: [],
      version: "Unknown",
      motd: "",
      latency: "Unknown"
    };

  }
}

/* ---------------- SERVER ANALYTICS ---------------- */

async function updateAnalytics() {

  const data = await fetchServerData();

  const count = document.getElementById("playercount");
  const version = document.getElementById("serverversion");
  const motd = document.getElementById("motd");
  const latency = document.getElementById("uptime");

  if (count)
    count.textContent = `${data.online} / ${data.max} players online`;

  if (version)
    version.textContent = `Version: ${data.version}`;

  if (motd)
    motd.textContent = `MOTD: ${data.motd}`;

  if (latency)
    latency.textContent = `Latency: ${data.latency} ms`;

}

/* ---------------- PLAYERS PAGE ---------------- */

async function updatePlayers() {

  const grid = document.getElementById("players");
  const count = document.getElementById("playercount");

  if (!grid) return;

  grid.innerHTML = "";

  const data = await fetchServerData();

  if (count)
    count.textContent = `${data.online} / ${data.max} players online`;

  if (data.players.length === 0) {

    if (data.online === 0) {

      grid.innerHTML = "<p>No players online</p>";
      return;

    }

    for (let i = 0; i < data.online; i++) {
      createPlayerCard("Player");
    }

    return;

  }

  data.players.forEach(name => {
    createPlayerCard(name);
  });

}

/* ---------------- PLAYER CARD ---------------- */

function createPlayerCard(name) {

  const grid = document.getElementById("players");

  const card = document.createElement("div");
  card.className = "player";

  card.innerHTML = `
    <img src="https://mc-heads.net/body/${name}/right">
    <p>${name}</p>
  `;

  card.onclick = () => openPlayer(name);

  grid.appendChild(card);

}

/* ---------------- PLAYER MODAL ---------------- */

function openPlayer(name) {

  const modal = document.createElement("div");

  modal.style = `
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

  modal.innerHTML = `
    <div style="background:#111827;padding:30px;border-radius:12px;text-align:center">
      <h2>${name}</h2>
      <img src="https://mc-heads.net/body/${name}" style="width:180px">
      <p>Click anywhere to close</p>
    </div>
  `;

  modal.onclick = () => modal.remove();

  document.body.appendChild(modal);

}

/* ---------------- LEADERBOARD ---------------- */

async function updateLeaderboard() {

  const board = document.getElementById("leaderboard");

  if (!board) return;

  board.innerHTML = "";

  const data = await fetchServerData();

  if (data.players.length === 0) {

    board.innerHTML = "<p>No ranked players online</p>";
    return;

  }

  const sorted = [...data.players].sort();

  sorted.forEach((name, index) => {

    const row = document.createElement("div");

    row.className = "leaderboard-player";

    row.innerHTML = `
      <h3>#${index + 1}</h3>
      <img src="https://mc-heads.net/head/${name}">
      <p>${name}</p>
    `;

    board.appendChild(row);

  });

}

/* ---------------- AUTO UPDATE ---------------- */

updateAnalytics();
updatePlayers();
updateLeaderboard();

setInterval(updateAnalytics, 15000);
setInterval(updatePlayers, 15000);
setInterval(updateLeaderboard, 15000);
