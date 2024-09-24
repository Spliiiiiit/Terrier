const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

let player = {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    color: "red",
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    speed: 5,
    gravity: 0.8,
    jumpPower: -15,
    canFallThrough: false
};

// Plateformes principales
let platforms = [
    { x: 0, y: 550, width: 500, height: 20, color: "green" },
    { x: 500, y: 400, width: 250, height: 20, color: "green" },
    { x: 900, y: 350, width: 200, height: 20, color: "green" },
    { x: 1300, y: 250, width: 200, height: 20, color: "green" },
    { x: 1700, y: 150, width: 200, height: 20, color: "green" },
    { x: 2100, y: 50, width: 200, height: 20, color: "green" },
];

// Petites plateformes
let smallPlatforms = [
    { x: 250, y: 450, width: 100, height: 10, color: "green" },
    { x: 400, y: 200, width: 75, height: 10, color: "green" },
    { x: 250, y: 150, width: 50, height: 10, color: "green" },
    { x: 150, y: 200, width: 75, height: 10, color: "green" },
    { x: 550, y: 300, width: 100, height: 10, color: "green" },
    { x: 1100, y: 300, width: 100, height: 10, color: "green" },
    { x: 1500, y: 200, width: 100, height: 10, color: "green" },
    { x: 1800, y: 100, width: 100, height: 10, color: "green" },
    { x: 2300, y: 0, width: 100, height: 10, color: "green" },
];

// Pics (Spikes)
let spikes = [
    { x: 400, y: 425, width: 10, height: 10, color: "red" },
    { x: 525, y: 250, width: 10, height: 10, color: "red" },
    { x: 800, y: 370, width: 10, height: 10, color: "red" },
    { x: 1250, y: 330, width: 10, height: 10, color: "red" },
    { x: 1600, y: 230, width: 10, height: 10, color: "red" },
    { x: 1900, y: 130, width: 10, height: 10, color: "red" },
];

// Murs
let walls = [
    { x: 800, y: -100, width: 50, height: 10000, color: "blue", active: true },
    { x: 1600, y: -100, width: 50, height: 10000, color: "blue", active: true },
];

// Boutons
let buttons = [
    { x: 100, y: 100, width: 30, height: 20, color: "blue" },
    { x: 1400, y: 180, width: 30, height: 20, color: "blue" },
];

// Billes à collecter
let redBalls = [
    { x: 225, y: 530, radius: 10, color: "pink", collected: false },
    { x: 250, y: 530, radius: 10, color: "pink", collected: false },
    { x: 200, y: 530, radius: 10, color: "pink", collected: false },
    { x: 275, y: 425, radius: 10, color: "pink", collected: false },
    { x: 300, y: 425, radius: 10, color: "pink", collected: false },
    { x: 325, y: 425, radius: 10, color: "pink", collected: false },
    { x: 1300, y: 170, radius: 10, color: "pink", collected: false },
    { x: 1800, y: 130, radius: 10, color: "pink", collected: false },
    { x: 2200, y: 30, radius: 10, color: "pink", collected: false },
];

// Compteur de billes collectées
let ballsCollected = 0;

function resetGame() {
    player.x = 50;
    player.y = 500;
    player.velocityX = 0;
    player.velocityY = 0;
    ballsCollected = 0;
    redBalls.forEach(ball => ball.collected = false);
    walls.forEach(wall => wall.active = true);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x - camera.x, platform.y - camera.y, platform.width, platform.height);
    });
}

function drawSmallPlatforms() {
    smallPlatforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x - camera.x, platform.y - camera.y, platform.width, platform.height);
    });
}

function drawWalls() {
    walls.forEach(wall => {
        if (wall.active) {
            ctx.fillStyle = wall.color;
            ctx.fillRect(wall.x - camera.x, wall.y - camera.y, wall.width, wall.height);
        }
    });
}

function drawButtons() {
    buttons.forEach(button => {
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x - camera.x, button.y - camera.y, button.width, button.height);
    });
}

function drawRedBalls() {
    redBalls.forEach(ball => {
        if (!ball.collected) {
            ctx.beginPath();
            ctx.arc(ball.x - camera.x, ball.y - camera.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.closePath();
        }
    });
}

function drawSpikes() {
    spikes.forEach(spike => {
        ctx.fillStyle = spike.color;
        ctx.fillRect(spike.x - camera.x, spike.y - camera.y, spike.width, spike.height);
    });
}

function updateGame() {
    // Position précédente du joueur avant mise à jour
    let prevY = player.y;

    // Mise à jour de la position du joueur
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Collision avec les grandes plateformes
    platforms.forEach(platform => {
        if (prevY + player.height <= platform.y && player.y + player.height >= platform.y &&
            player.x + player.width > platform.x && player.x < platform.x + platform.width && !player.canFallThrough) {
            player.isJumping = false;
            player.y = platform.y - player.height;
            player.velocityY = 0;
        }
    });

    // Collision avec les petites plateformes
    smallPlatforms.forEach(platform => {
        if (prevY + player.height <= platform.y && player.y + player.height >= platform.y &&
            player.x + player.width > platform.x && player.x < platform.x + platform.width && !player.canFallThrough) {
            player.isJumping = false;
            player.y = platform.y - player.height;
            player.velocityY = 0;
        }
    });

    // Collision avec les murs
    walls.forEach(wall => {
        if (wall.active && player.x + player.width > wall.x && player.x < wall.x + wall.width &&
            player.y + player.height > wall.y && player.y < wall.y + wall.height) {
            player.x = wall.x - player.width;
        }
    });

    player.x += player.velocityX;

    // Limites de l'écran
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Collecte des billes
    redBalls.forEach(ball => {
        if (!ball.collected && player.x < ball.x + ball.radius && player.x + player.width > ball.x - ball.radius &&
            player.y < ball.y + ball.radius && player.y + player.height > ball.y - ball.radius) {
            ball.collected = true;
            ballsCollected++;
        }
    });

    // Victoire si toutes les billes sont collectées
    if (ballsCollected === redBalls.length) {
        alert("Vous avez collecté toutes les billes !");
        resetGame();
    }

    // Collision avec les pics
    spikes.forEach(spike => {
        if (player.x + player.width > spike.x && player.x < spike.x + spike.width &&
            player.y + player.height > spike.y && player.y < spike.y + spike.height) {
            resetGame();
        }
    });

    // Mort si le joueur tombe dans le vide
    if (player.y > canvas.height) {
        resetGame();
    }

    // Mise à jour de la caméra
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;

    camera.x = Math.max(0, Math.min(camera.x, 2500 - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, 800 - canvas.height));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlatforms();
    drawSmallPlatforms();
    drawWalls();
    drawButtons();
    drawRedBalls();
    drawSpikes();
    drawPlayer();

    updateGame();

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
        player.velocityX = player.speed;
    } else if (event.code === "ArrowLeft") {
        player.velocityX = -player.speed;
    } else if (event.code === "ArrowUp" && !player.isJumping) {
        player.isJumping = true;
        player.velocityY = player.jumpPower;
    } else if (event.code === "ArrowDown") {
        player.canFallThrough = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        player.velocityX = 0;
    } else if (event.code === "ArrowDown") {
        player.canFallThrough = false;
    }
});

// Démarrer la boucle de jeu
gameLoop();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
