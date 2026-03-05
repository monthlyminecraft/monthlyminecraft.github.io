// ---------------------- Server IP Copy ----------------------
function copyIP(){
  navigator.clipboard.writeText("rowbot.in:25565");
  alert("Server IP copied!");
}

// ---------------------- Live Player List + Skins ----------------------
function updatePlayers(){
  const container = document.getElementById("players");
  container.innerHTML = "";
  fetch("https://api.mcsrvstat.us/2/rowbot.in:25565")
  .then(r=>r.json())
  .then(data=>{
    document.getElementById("playercount").innerText = data.players.online + " / " + data.players.max + " players online";
    
    if(data.players.list){
      data.players.list.forEach(name=>{
        const p = document.createElement("div");
        p.className="player";
        p.innerHTML = `<img src="https://crafatar.com/renders/body/${name}?overlay"><p>${name}</p>`;
        p.onclick = ()=>alert("Profile clicked: " + name);
        container.appendChild(p);
      });
    }
    
    // ------------------- Server Analytics -------------------
    document.getElementById("serverversion").innerText = "Version: " + (data.version || "Unknown");
    document.getElementById("motd").innerText = "MOTD: " + (data.motd?.clean?.join(" ") || "Unknown");
    document.getElementById("uptime").innerText = "Players Online: " + data.players.online;
  });
}

// Initial load
updatePlayers();
// Update every 15 seconds
setInterval(updatePlayers, 15000);
