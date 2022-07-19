// canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1100;
canvas.height = 500;


class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', e => {
            if ((   (e.key === 'd') || 
                    (e.key === 'a') ||
                    (e.key === 'w') ||
                    (e.key === 'f')
            
            ) && this.game.keys.indexOf(e.key) === -1) {
                this.game.keys.push(e.key);
            } 
        });
        window.addEventListener('click', e => {
            this.game.player.shootGun();
        })

        window.addEventListener('keyup', e => {
            if (this.game.keys.indexOf(e.key) > -1) {
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
            }
        });
    }
}

class Platform {
    constructor(game) {
        this.game = game;
        this.x = 500;
        this.y = 320;
        this.width = 50;
        this.height = 5;
    }
    update() {

    }
    draw(context) {
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = 7;
        this.markedForDeletion = false;
    }
    update() {
        this.x += this.speed;
        if (this.x > this.game.width * 0.99) this.markedForDeletion = true;
    }
    draw(context) {
        context.fillStyle = 'yellow';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player {
    constructor(game) {
        this.game = game;
        this.width = 48; //48
        this.height = 48;
        this.x = 20;
        this.y = 350; 
        this.frameX = 0;
        this.frameY = 0;
        this.speedX = 0;  
        this.speedY = 0;
        this.maxSpeedX = 3;
        this.maxSpeedY = 20;
        this.gravity = 0.01;
        this.gravitySpeed = 6;
        this.projectiles = [];
        this.image = document.getElementById('player');
    }
    update() {
        if (this.game.keys.includes('d')) this.speedX = this.maxSpeedX;
        else if (this.game.keys.includes('a')) this.speedX = -this.maxSpeedX;
        else this.speedX = 0;
        this.x += this.speedX;

        if (this.game.keys.includes('w')) this.speedY = -this.maxSpeedY;
        else this.speedY = 0;

        if (this.height + this.y >= 500) {
            this.gravity = 0;
            this.gravitySpeed = 0;
        } else {
            this.gravity = 0.05;
            this.gravitySpeed = 6;
        }

        if (this.height + this.y >= 1) {
            console.log('you are in canvas');
        } else {
            this.y = 2;
        }

        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;

        // manage projectiles 
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        // sprite animation

    }
    draw(context) {
        context.strokeStyle = 'red';
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        this.projectiles.forEach(projectile => {
            projectile.draw(context);
        });
    }
    shootGun() {
        this.projectiles.push(new Projectile(this.game, this.x, this.y));
        console.log(this.projectiles);
    }
}

class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1700;
        this.height = 500;
        this.x = 0;
        this.y = 15;
    }
    update() {
        if (this.x <= -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }
}

class Background {
    constructor(game) {
        this.game = game;
        this.image1 = document.getElementById('background');
        this.layer1 = new Layer(this.game, this.image1, 0);
        this.layers = [this.layer1];
    }
    update() {
        this.layers.forEach(layer => layer.update());
    }
    draw(context) {
        this.layers.forEach(layer => layer.draw(context));
    }
}


class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.keys = [];
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.speed = 1;
        this.gameOver = false;
    }
    update() {
        this.background.update();
        this.player.update();
    }
    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
    }
}

const game = new Game(canvas.width, canvas.height);
// animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
}
animate();
