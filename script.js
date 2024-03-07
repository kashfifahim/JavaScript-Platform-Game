const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;

let isCheckpointCollisionDetectionActive = true;

const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size/500) * innerHeight) : size;
};

// define characteristics for the main player of the game
class Player {
    constructor() {
        this.position = {
            // You want the the player to be able to move regardless of screen size
            x: proportionalSize(10),
            y: proportionalSize(400),
        };
        // store the player's speed
        this.velocity = {
            x: 0,
            y: 0,
        }
        // using proportionalSize() to set w, h to be proportional to screen
        this.width = proportionalSize(40);
        this.height = proportionalSize(40);
    }

    draw() {
        ctx.fillStyle = "#99c9ff";
        // player's shape
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // responsible for updating the player's position, velocity
    update() {
        // player is continually being updated
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // condition to stop the player from falling past the height of canvas
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            if (this.position.y < 0) {
                this.position.y = 0;
                this.velocity.y = gravity;
            }
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

        // Player stays inside the boundaries of the canvas screen
        if (this.position.x < this.width) {
            this.position.x = this.width;
        }

        // Check if Player's x position exceed the right edge of the canvas
        if (this.position.x >= canvas.width - 2 * this.width) {
            this.position.x = canvas.width - 2 * this.width;
        }
    }
}

// Platforms and their logic
class Platform {
    constructor(x, y) {
        this.position = {
            x, 
            y,
        };
        this.width = 200;
        this.height = proportionalSize(40);
    }
    draw() {
        ctx.fillStyle = "#acd157";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();

// list of positions for the platforms
const platformPositions = [
    {
        x: 500,
        y: proportionalSize(450),
    },
];

// Functionality for moving the player across the screen
const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
        player.velocity.x = 5;
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;
    }
}

const keys = {
    rightKey: {pressed: false},
    leftKey: {pressed: false},
}

// functionality responsible for moving the player across the screen
const movePlayer = (key, xVelocity, isPressed) => {
    if(!isCheckpointCollisionDetectionActive) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        return;
    }
    switch(key){
        case "ArrowLeft":
            keys.leftKey.pressed = isPressed;
            if(xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x -= xVelocity;
            break;
        case "ArrowUp":
        case " ":
        case "Spacebar":
            player.velocity.y -= 8;
            break;
        case "ArrowRight":
            keys.rightKey.pressed = isPressed;
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x += xVelocity;
            break;
    }
}

const startGame = () => {
    canvas.style.display = "block";
    startScreen.style.display = "none";
    animate();

};

startBtn.addEventListener("click", startGame);

window.addEventListener("keydown", ({key}) => {
    movePlayer(key, 8, true);
});

window.addEventListener("keyup", ({key}) => {
    movePlayer(key, 0, false);
});