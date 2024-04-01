

// Player Class. Movement and animation of the player character.
class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;

        // Player's Speed
        this.speed = 10;
    }

    // Draw Player's Model
    draw(context){
        context.fillRect(this.x, this.y, this.width, this.height)
    }

    // Update's Player's Data
    update(){

        // ArrowLeft was pressed
        if(this.game.keys.indexOf('ArrowLeft') > -1){
            // Update horizontal player position
        this.x -= this.speed;
        }

        // ArrowRight was pressed
        if(this.game.keys.indexOf('ArrowRight') > -1){
            // Update horizontal player position
        this.x += this.speed;
        }

        // Horizontal Boundaries
        if(this.x < 0){
            this.x = 0;
        }

        if(this.x > this.game.width - this.width){
            this.x = this.game.width - this.width;
        }
        
    }

    // Shoot Projectile
    shoot(){
        const projectile = this.game.getProjectile();

        if(projectile){
            projectile.start(this.x + this.width * 0.5, this.y);
        }
    }
}

// Projectile Class. Player's shooting elements
class Projectile {
    constructor(){
        this.width = 4;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.speed = 20;

        // Projectile is sitting in the poop and ready to be used.
        this.free = true;
    }

    // Render projectile
    draw(context){
        if(!this.free){
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // Update projectile's data
    update(){
        if(!this.free){
            this.y -= this.speed;
        }

        // Reset projectiles and become available in the pool again when they fly off screen
        if(this.y < -this.height){
            this.reset();
        }
    }

    // Shoot projectile
    start(x, y){
        this.x = x - this.width * 0.5;
        this.y = y;
        this.free = false;
    }

    // Return back to the object pool
    reset(){
        this.free = true;
    }
}

// Enemy Class. Draw and animate enemies
class Enemy {
    constructor(game, positionX, positionY){
        this.game = game;
        this.width = this.game.enemySize;
        this.height = this.game.enemySize;
        this.x;
        this.y;
        this.positionX = positionX;
        this.positionY = positionY;
        this.markedForDeletion = false;
    }

    // Render Enemy
    draw(context){
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    // Update enemies movement
    update(x, y){
        this.x = x + this.positionX;
        this.y = y + this.positionY;

        // Check collision between enemies and projectiles
        this.game.projectilesPool.forEach(projectile => {
            if(!projectile.free && this.game.checkCollision(this, projectile)){
                this.markedForDeletion = true;

                // Reset projectiles when it hits enemy
                projectile.reset();

                // When enemy is destroyed scores increase by 1
                this.game.scores += 1;
            }
        });

        // Lose Condition
        if(this.y + this.height > this.game.height){
            this.game.gameOver = true;
            this.markedForDeletion = true;
        }

    }

}

class Wave {
    constructor(game){
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = 0;
        this.y = -this.height;
        this.speedX = 3;
        this.speedY = 0;

        this.enemies = [];

        // When wave os enemies is destroyed trigger new wave
        this.nextWaveTrigger = false; 

        this.create();
    }

    // Update wave position
    render(context){

        this.speedY = 0;

        //context.strokeRect(this.x, this.y, this.width, this.height);
        this.x += this.speedX;

        // Waves Horizontal Boundaries
        if(this.x < 0 || this.x > this.game.width - this.width){
            this.speedX *= -1;

            // Waves Vertical Movement
            this.speedY = this.game.enemySize;

            this.y += this.speedY;
            this.x += this.speedX;
        }

        if(this.y < 0) this.y += 3;

        this.enemies.forEach(enemy => {
            enemy.update(this.x, this.y);
            enemy.draw(context);
        });

        this.enemies = this.enemies.filter(object => !object.markedForDeletion)
    }

    // Create array that contains wave of enemies
    create(){

        for(let y = 0; y < this.game.rows; y++){
            for(let x = 0; x < this.game.columns; x++){
                let enemyX = x * this.game.enemySize;
                let enemyY = y * this.game.enemySize;
                this.enemies.push(new Enemy(this.game, enemyX, enemyY))
            }
        }

        
    }
    
}

// Game Class. Main logic of the game
class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);

        // Pressed Keys
        this.keys = []

        // Projectiles Pool
        this.projectilesPool = [];
        this.numberOfProjectiles = 10;
        this.createProjectiles();
        
        // Grid(columns and rows) of enemies
        this.columns = 3;
        this.rows = 3;
        this.enemySize = 60;

        // Waves of enemies
        this.waves = [];
        this.waves.push(new Wave(this));
        // Number of waves
        this.waveCount = 1;

        // Scores
        this.scores = 0;

        // Game over.
        this.gameOver = false;

        // Events

        // Add pressed key into the array
        window.addEventListener('keydown', (e) => {
            
            if(this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key)
            }
            
            // Shoot Projectile
            if(e.key === '1'){
                this.player.shoot();
            }
        })

        // Remove pressed key into the array
        window.addEventListener('keyup', (e) => {
            
            const index =  this.keys.indexOf(e.key)

            if(index > -1){
                this.keys.splice(index, 1);
                console.log(this.keys);
            }
                
        })

    
    }

    // Draw objects
    render(context){
        this.drawStatus(context)
        this.player.draw(context);
        this.player.update();
        this.projectilesPool.forEach(projectile => {
            projectile.update();
            projectile.draw(context);
        });

        this.waves.forEach(wave => {
            wave.render(context);

            if(wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver){
                this.newWave();
                this.waveCount += 1;
                wave.nextWaveTrigger = true;
            }
        });
    }

    // Create projectiles onject pool
    createProjectiles(){
        for(let i = 0; i < this.numberOfProjectiles; i++){
            this.projectilesPool.push(new Projectile());
        }
    }

    // Get free projectile object from the pool
    getProjectile(){
        for(let i = 0; i < this.projectilesPool.length; i++){
            if(this.projectilesPool[i].free){
                return this.projectilesPool[i];
            }
        }
    }

    // Collision Detection
    checkCollision(a, b){
        
        return(a.x < b.x + b.width &&
               a.x + a.width > b.x && 
               a.y < b.y + b.height &&
               a.y + a.height > b.y
            ) 
    }

    // Player's Status (Lives, Ammoes, Scores)
    drawStatus(context){
        context.save();
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowColor = 'black';
        context.fillText(`Score: ${this.scores}`, 20, 40);
        context.fillText(`Wave: ${this.waveCount}`, 20, 80);

        // If game is over
        if(this.gameOver){
            context.textAlign = 'center';
            context.font = 100;
            context.fillText('GAME OVER', this.width * 0.5, this.height * 0.5);
        }
        context.restore();
    }


    // Waves Generation
    newWave(){
        this.columns++;
        this.rows++;
        this.waves.push(new Wave(this));
    }
}


window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas1');
    const context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 900;
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    context.lineWidth = 5;

    // Status text
    context.font = '30px Impact';

    const game = new Game(canvas);
    

    function animate(){
        // Clear Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        game.render(context);
        window.requestAnimationFrame(animate);
    }
    animate();
});