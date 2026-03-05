// ---------------------- 3D Spinning Blocks ----------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("three-bg"), alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);

const blocks = [];
for(let i=0;i<50;i++){
  const geometry = new THREE.BoxGeometry(Math.random()*2+0.5, Math.random()*2+0.5, Math.random()*2+0.5);
  const material = new THREE.MeshBasicMaterial({color:0x22c55e});
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(Math.random()*20-10, Math.random()*20-10, Math.random()*20-10);
  scene.add(cube);
  blocks.push(cube);
}
camera.position.z = 20;

function animateThree(){
  requestAnimationFrame(animateThree);
  blocks.forEach(c=>{
    c.rotation.x += 0.01;
    c.rotation.y += 0.01;
  });
  renderer.render(scene, camera);
}
animateThree();

window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

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
    document.getElementById("serverversion").innerText = "Version: " + data.version;
    document.getElementById("motd").innerText = "MOTD: " + data.motd.clean.join(" ");
    document.getElementById("uptime").innerText = "Players Online: " + data.players.online;
  });
}
updatePlayers();
setInterval(updatePlayers, 15000); // update every 15s
