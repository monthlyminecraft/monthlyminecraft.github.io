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
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

// ===== Load block images =====
const blockImages = [];
for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = `assets/blocks/block${i}.png`;
    blockImages.push(img);
}

// ===== Blocks & particles =====
const blocks = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 0.5 + Math.random(),
    img: blockImages[Math.floor(Math.random() * blockImages.length)],
    size: 32
}));

const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 2 + Math.random() * 3,
    speed: 0.2 + Math.random() * 0.3,
    alpha: 0.2 + Math.random() * 0.3
}));

// ===== Animate blocks =====
function animateBlocks() {
    blocks.forEach(b => {
        b.y += b.speed;
        if (b.y > canvas.height) b.y = -b.size;
        ctx.drawImage(b.img, b.x, b.y, b.size, b.size);
    });
}

// ===== Animate particles =====
function animateParticles() {
    particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;

        // subtle mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 100) { // radius of influence
                p.x += dx * 0.002; // subtle movement
                p.y += dy * 0.002;
            }
        }

        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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

// ===== Section fade-in =====
window.addEventListener('load', () => {
    document.querySelectorAll('section').forEach(s => setTimeout(() => s.classList.add('visible'), 100));
});

// ===== Fetch server stats (MCPing via corsproxy.io) =====
const SERVER_IP = 'rowbot.in';

async function fetchServerStats() {
    try {
        const proxyURL = 'https://corsproxy.io/?' + encodeURIComponent(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const response = await fetch(proxyURL);
        const data = await response.json();

        const online = data.players?.online || 0;
        const max = data.players?.max || 0;
        document.getElementById('players').textContent = `${online}/${max}`;

        const leaderboard = document.getElementById('top-players');
        leaderboard.innerHTML = '';
        for (let i = 1; i <= Math.min(5, online); i++) {
            const li = document.createElement('li');
            li.textContent = `Player${i} - Score`; // placeholder leaderboard
            leaderboard.appendChild(li);
        }
    } catch (err) {
        console.error('Failed to fetch server stats:', err);
        document.getElementById('players').textContent = 'Offline';
    }
}

// fetch every 10 seconds
setInterval(fetchServerStats, 10000);
fetchServerStats();
