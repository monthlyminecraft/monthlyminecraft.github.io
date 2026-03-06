document.getElementById('players').textContent = Math.floor(Math.random() * 50) + 1;
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const blockImages = [];
const blockCount = 50;

// Load block images
for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = `assets/blocks/block${i}.png`;
    blockImages.push(img);
}

const blocks = [];
for (let i = 0; i < blockCount; i++) {
    blocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random(),
        img: blockImages[Math.floor(Math.random() * blockImages.length)],
        size: 32
    });
}

function animateBlocks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach(block => {
        block.y += block.speed;
        if (block.y > canvas.height) block.y = -block.size;
        ctx.drawImage(block.img, block.x, block.y, block.size, block.size);
    });
    requestAnimationFrame(animateBlocks);
}
animateBlocks();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
