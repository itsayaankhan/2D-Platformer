// canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 500;

class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', e => {
            if ((   (e.key === 'd') || 
                    (e.key === 'a')
            
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

class Ammo {
    constructor() {

    }
}

class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = 3;
        this.markedForDeletion = false;
    }
    update() {
        this.x += this.speed;
        if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context) {
        context.fillStyle = 'yellow';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player {
    constructor(game) {
        this.game = game;
        this.width = 37;
        this.height = 55;
        this.x = 20;
        this.y = 449; 
        this.speedX = 0;  
        this.speedY = 0;
        this.maxSpeedX = 3;
        this.maxSpeedY = 0;
        this.projectiles = [];
    }
    update() {
        if (this.game.keys.includes('d')) this.speedX = this.maxSpeedX;
        else if (this.game.keys.includes('a')) this.speedX = -this.maxSpeedX;
        else this.speedX = 0;
        this.x += this.speedX;
        // manage projectiles 
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
    }
    draw(context) {
        context.fillStyle = 'black';
        context.fillRect(this.x, this.y, this.width, this.height);
        this.projectiles.forEach(projectile => {
            projectile.draw(context);
        });
    }
    shootGun() {
        this.projectiles.push(new Projectile(this.game, this.x, this.y));
        console.log(this.projectiles);
    }
}

class Enemy {
    constructor() {

    }
}

class Layer {
    constructor() {

    }
}

class Background {
    constructor() {

    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.keys = [];
    }
    update() {
        this.player.update();
    }
    draw(context) {
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