// ===== Canvas setup =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== Minecraft blocks animation =====
const blockImages = [];
for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = `assets/blocks/block${i}.png`;
    blockImages.push(img);
}

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

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 3,
        speed: 0.2 + Math.random(),
        alpha: 0.2 + Math.random() * 0.3
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    blocks.forEach(block => {
        block.y += block.speed;
        if (block.y > canvas.height) block.y = -block.size;
        ctx.drawImage(block.img, block.x, block.y, block.size, block.size);
    });
    
    particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}
animate();

// ===== Smooth section transitions =====
window.addEventListener('load', () => {
    document.querySelectorAll('section').forEach(sec => {
        setTimeout(() => sec.classList.add('visible'), 100);
    });
});

// ===== Dummy server stats =====
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

// ===== Handle window resize =====
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
