fetch('https://api.mcsrvstat.us/2/YOUR_SERVER_IP')
    .then(res => res.json())
    .then(data => {
        document.getElementById('players').textContent = data.players.online;
        // No leaderboard support here; only online count
    });
// ===== Canvas setup =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== Mouse tracking =====
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// ===== Load block images =====
const blockImages = [];
for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = `assets/blocks/block${i}.png`;
    blockImages.push(img);
}

// ===== Create blocks =====
const blocks = [];
for (let i = 0; i < 50; i++) {
    blocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random(),
        img: blockImages[Math.floor(Math.random() * blockImages.length)],
        size: 32
    });
}

// ===== Create particles =====
const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 3,
        speed: 0.2 + Math.random() * 0.3,
        alpha: 0.2 + Math.random() * 0.3
    });
}

// ===== Animate blocks =====
function animateBlocks() {
    blocks.forEach(block => {
        block.y += block.speed;
        if (block.y > canvas.height) block.y = -block.size;
        ctx.drawImage(block.img, block.x, block.y, block.size, block.size);
    });
}

// ===== Animate particles =====
function animateParticles() {
    particles.forEach(p => {
        // Normal movement
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;

        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < 100) { // radius of influence
                p.x += dx * 0.01;  // pull strength
                p.y += dy * 0.01;
            }
        }

        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
    });
}

// ===== Main animation loop =====
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animateBlocks();
    animateParticles();
    requestAnimationFrame(animate);
}
animate();

// ===== Smooth section transitions =====
window.addEventListener('load', () => {
    document.querySelectorAll('section').forEach(sec => {
        setTimeout(() => sec.classList.add('visible'), 100);
    });
});

// ===== Dummy server stats (replace with JSONAPI/WebSocket for live) =====
function fetchServerStats() {
    const online = Math.floor(Math.random() * 50) + 1;
    document.getElementById('players').textContent = online;
    
    const leaderboard = document.getElementById('top-players');
    leaderboard.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const li = document.createElement('li');
        li.textContent = `Player${i} - ${Math.floor(Math.random()*100)} Points`;
        leaderboard.appendChild(li);
    }
}
setInterval(fetchServerStats, 5000);
fetchServerStats();
