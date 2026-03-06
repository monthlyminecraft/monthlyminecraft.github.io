const SERVER_IP = "rowbot.in:25565"; // put your server IP here

async function loadServerData() {
    try {

        const res = await fetch(`https://mcapi.us/server/status?ip=${SERVER_IP}`);
        const data = await res.json();

        const playerCount = document.getElementById("playerCount");
        const playerList = document.getElementById("playerList");

        if (!data || !data.online) {
            playerCount.innerText = "Offline";
            return;
        }

        const online = data.players?.now ?? 0;
        playerCount.innerText = online;

        playerList.innerHTML = "";

        if (data.players && data.players.sample) {

            const players = data.players.sample;

            players.forEach((p, i) => {

                const card = document.createElement("div");
                card.className = "player-card";

                card.innerHTML = `
                    <div class="rank">#${i + 1}</div>
                    <img src="https://mc-heads.net/avatar/${p.name}" class="avatar">
                    <div class="name">${p.name}</div>
                `;

                playerList.appendChild(card);
            });

        } else {
            playerList.innerHTML = "<p>No players online</p>";
        }

    } catch (err) {
        console.error(err);
        document.getElementById("playerCount").innerText = "Error";
    }
}

loadServerData();
setInterval(loadServerData, 30000);
