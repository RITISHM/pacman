function collison(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ========== ENTITY CLASSES ==========

// Base class for all game objects
class Entity {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.startY = y;
    }

    draw(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

// Static entity: Wall tile
class Wall extends Entity {
    constructor(image, x, y, width, height) {
        super(image, x, y, width, height);
    }
}

// Static entity: Food dot (no image, drawn as a filled rectangle)
class Food extends Entity {
    constructor(x, y, width, height) {
        super(null, x, y, width, height);
    }

    draw(ctx) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Base class for moving entities (Pacman and Ghosts)
class Character extends Entity {
    constructor(image, x, y, width, height) {
        super(image, x, y, width, height);
        this.direction = "R";
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();

        // Test move to check wall collision
        this.x += this.velocityX;
        this.y += this.velocityY;

        let hitWall = false;
        for (let wall of walls.values()) {
            if (collison(this, wall)) {
                hitWall = true;
                break;
            }
        }

        // Always revert the test move
        this.x -= this.velocityX;
        this.y -= this.velocityY;

        // If turn was invalid, revert direction
        if (hitWall) {
            this.direction = prevDirection;
            this.updateVelocity();
        }
    }

    updateVelocity() {
        if (this.direction == "U") {
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        } else if (this.direction == "D") {
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        } else if (this.direction == "R") {
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction == "L") {
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction == "S") {
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
}

// Pacman: handles directional sprite switching
class Pacman extends Character {
    constructor(image, x, y, width, height) {
        super(image, x, y, width, height);
        this.nextDirection = this.direction;
        this.isDying = false;
        this.visible = true;
        this.updateVelocity();
    }

    updateDirection(direction) {
        super.updateDirection(direction);
        // Update sprite based on current facing direction
        if (this.direction == "U") {
            this.image = pacmanUpImage;
        } else if (this.direction == "D") {
            this.image = pacmanDownImage;
        } else if (this.direction == "L") {
            this.image = pacmanLeftImage;
        } else if (this.direction == "R") {
            this.image = pacmanRightImage;
        }
    }
}

// Ghost: stores ghost name/type for future AI behaviors
class Ghost extends Character {
    constructor(image, x, y, width, height, name) {
        super(image, x, y, width, height);
        this.name = name; // "red", "pink", "blue", "orange"
    }
}
