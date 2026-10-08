//board
console.log("js Loaded");
let board;
const rowCount = 21;
const colCount = 19;
const tileSize = 40;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

//images
let blueGhostImage;
let pinkGhostImage;
let orangeGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//audios
let eatSound;
let failSound;
let isMute;
let muteBtn;
//stats
let scoreElement;
let score;
let livesElement;
let lives;

//animation
let lastBlink;
let wait;

//game over screen
let gameOverOverlay;
let finalScore;
let playAgainBtn;
//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O    X  bpo  X    O",
    "XXXX X XXXXX X XXXX",
    "OOOX           XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX",
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;
const directions = ["U", "D", "L", "R"];

window.onload = function () {
    board = document.getElementById("board");
    scoreElement = document.getElementById("score");
    score = 0;
    livesElement = this.document.getElementById("lives");
    lives = 3;
    board.height = boardHeight;
    board.width = boardWidth;
    wait = true;
    context = board.getContext("2d");
    isMute = true;
    muteBtn = this.document.getElementById("gameSoundBtn");
    gameOverOverlay = this.document.getElementById("gameOverOverlay");
    finalScore = this.document.getElementById("finalScoreText");
    playAgainBtn = this.document.getElementById("playAgainBtn");

    playAgainBtn.addEventListener("click", () => {
        loadMap();
        gameOverOverlay.classList.add("hidden");
    }
    );
    loadImages();
    loadAudio();
    loadMap();
    // console.log(walls.size);
    // console.log(foods.size);
    // console.log(ghosts.size);
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)]; //0-3
        ghost.updateDirection(newDirection);
    }
    update();
    document.addEventListener("keyup", movePacman);
};

function loadImages() {
    wallImage = new Image();
    wallImage.src = "/assets/images/wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "/assets/images/blueGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "/assets/images/redGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "/assets/images/pinkGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "/assets/images/orangeGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "/assets/images/pacmanUp.png";

    pacmanDownImage = new Image();
    pacmanDownImage.src = "/assets/images/pacmanDown.png";

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "/assets/images/pacmanLeft.png";

    pacmanRightImage = new Image();
    pacmanRightImage.src = "/assets/images/pacmanRight.png";
}

function loadAudio() {
    eatSound = new Audio("/assets/audio/pacman-eating-food-dots.mp3");
    eatSound.loop = true;
    failSound = new Audio("/assets/audio/fail.mp3");
    muteBtn.addEventListener("click", () => {
        isMute = !isMute;
        muteBtn.innerText = `🔊 SOUND: ${isMute ? "OFF" : " ON"}`;
        failSound.muted = isMute;
        eatSound.muted = isMute;
    });
}

function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();
    lives = 3;
    score = 0;
    scoreElement.innerHTML = `Score: ${score}`;
    for (let i = 0; i < 3; i++) {
        const life = livesElement.children[i];
        life.classList.remove("lost");
    }
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == "X") {
                walls.add(new Wall(wallImage, x, y, tileSize, tileSize));
            } else if (tileMapChar == "b") {
                ghosts.add(new Ghost(blueGhostImage, x, y, tileSize, tileSize, "blue"));
            } else if (tileMapChar == "o") {
                ghosts.add(new Ghost(orangeGhostImage, x, y, tileSize, tileSize, "orange"));
            } else if (tileMapChar == "p") {
                ghosts.add(new Ghost(pinkGhostImage, x, y, tileSize, tileSize, "pink"));
            } else if (tileMapChar == "r") {
                ghosts.add(new Ghost(redGhostImage, x, y, tileSize, tileSize, "red"));
            } else if (tileMapChar == "P") {
                pacman = new Pacman(pacmanRightImage, x, y, tileSize, tileSize);
            } else if (tileMapChar == " ") {
                foods.add(new Food(x + 14, y + 14, 4, 4));
            }
        }
    }
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
    wait = true;
    setTimeout(() => { wait = false }, 2000);
}

function reloadMap() {
    if (lives === 0) {
        wait = true;
        finalScore.innerHTML = `Score: ${score}`;
        gameOverOverlay.classList.remove("hidden");
        return;
    }
    else {
        ghosts.clear();
        for (let r = 0; r < rowCount; r++) {
            for (let c = 0; c < colCount; c++) {
                const row = tileMap[r];
                const tileMapChar = row[c];

                const x = c * tileSize;
                const y = r * tileSize;

                if (tileMapChar == "b") {
                    ghosts.add(new Ghost(blueGhostImage, x, y, tileSize, tileSize, "blue"));
                } else if (tileMapChar == "o") {
                    ghosts.add(new Ghost(orangeGhostImage, x, y, tileSize, tileSize, "orange"));
                } else if (tileMapChar == "p") {
                    ghosts.add(new Ghost(pinkGhostImage, x, y, tileSize, tileSize, "pink"));
                } else if (tileMapChar == "r") {
                    ghosts.add(new Ghost(redGhostImage, x, y, tileSize, tileSize, "red"));
                } else if (tileMapChar == "P") {
                    pacman = new Pacman(pacmanRightImage, x, y, tileSize, tileSize);
                }
            }
        }
        wait = true;
        setTimeout(() => { wait = false }, 1000);
    }
    for (let i = 0; i < 3; i++) {
        if (i < lives) continue;
        const life = livesElement.children[i];
        life.classList.add("lost");
    }
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)]; //0-3
        ghost.updateDirection(newDirection);
    }
}

function update() {
    if (pacman.isDying) {
        blink();
    }
    else if (!pacman.isDying && !wait) {
        move();
    }
    draw();
    setTimeout(update, 1000 / 20);
}

function blink() {
    const currentTime = Date.now();

    if (!lastBlink || currentTime - lastBlink > 200) {
        pacman.visible = !pacman.visible;
        lastBlink = currentTime;
    }

}

function draw() {
    context.clearRect(0, 0, board.width, board.height);

    for (let ghost of ghosts) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    if (pacman.visible) {
        context.drawImage(
            pacman.image,
            pacman.x,
            pacman.y,
            pacman.width,
            pacman.height,
        );
    }
    for (let wall of walls) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    context.fillStyle = "yellow";
    for (let food of foods) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }
}

function move() {
    if (pacman.direction !== pacman.nextDirection) {
        if (pacman.nextDirection === "U" || pacman.nextDirection === "D") {
            if (pacman.x >= 0 && pacman.x <= boardWidth - tileSize) {
                pacman.updateDirection(pacman.nextDirection);
            }
        } else {
            pacman.updateDirection(pacman.nextDirection);
        }
    }
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    if (pacman.x <= -tileSize && pacman.direction == "L") {
        pacman.x = boardWidth;
    } else if (pacman.x >= boardWidth && pacman.direction == "R") {
        pacman.x = -tileSize;
    }
    for (let wall of walls.values()) {
        if (collison(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    for (let ghost of ghosts.values()) {
        if (collison(pacman, ghost)) {
            lives--;
            pacman.isDying = true;
            failSound.play().catch(err => console.log("Audio error:", err))
                ;
            if (pacman.isDying) {
                setTimeout(() => {
                    pacman.isDying = false;
                    reloadMap();
                    pacman.visible = true;
                }, 2000);

            }
            break;
        }
        if (ghost.x <= -tileSize && ghost.direction == "L") {
            ghost.x = boardWidth;
        } else if (ghost.x >= boardWidth && ghost.direction == "R") {
            ghost.x = -tileSize;
        }

        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;
        for (let wall of walls.values()) {
            if (collison(ghost, wall)) {
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection = getGhostDirections(ghost);
                ghost.updateDirection(newDirection);
            }
        }
    }
    let ateFoodThisFrame = false;
    for (let food of foods) {
        if (collison(pacman, food)) {
            foods.delete(food);
            score += 1;
            scoreElement.innerHTML = `Score: ${score}`;
            ateFoodThisFrame = true;
            break;
        }
    }

    if (foods.size === 0) {
        // Prevent multiple alerts by removing eatSound pause check 
        // to simplify. We'll just alert and let the loop run (empty map).
        if (!window.winAlertShown) {
            window.winAlertShown = true;
            setTimeout(() => alert("You Win!"), 100);
        }
    }

    if (ateFoodThisFrame) {
        if (eatSound.paused) {
            eatSound.play().catch(err => console.log("Audio error:", err));
        }
    } else {
        if (!eatSound.paused) {
            eatSound.pause();
            eatSound.currentTime = 0; // Optional: reset track position when stopping
        }
    }
}

function getGhostDirections(ghost) {
    const validDirections = [];
    const opposites = { "U": "D", "D": "U", "L": "R", "R": "L" };
    const backward = opposites[ghost.direction];

    for (let dir of directions) {
        if (dir === backward) continue; // Don't reverse unless forced

        // Test this direction
        ghost.direction = dir;
        ghost.updateVelocity();
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        let hitWall = false;
        for (let wall of walls.values()) {
            if (collison(ghost, wall)) {
                hitWall = true;
                break;
            }
        }

        // Revert test
        ghost.x -= ghost.velocityX;
        ghost.y -= ghost.velocityY;

        if (!hitWall) {
            validDirections.push(dir);
        }
    }

    // Revert to original direction so we don't mess up current state
    ghost.direction = backward ? opposites[backward] : "R";
    ghost.updateVelocity();

    if (validDirections.length > 0) {
        return validDirections[Math.floor(Math.random() * validDirections.length)];
    } else {
        // If stuck (dead end), must reverse
        return backward || directions[Math.floor(Math.random() * 4)];
    }
}

