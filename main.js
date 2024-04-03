

// Player Class. Movement and animation of the player character.
class Player {
    constructor(game){
        this.game = game;
        this.width = 140;
        this.height = 120;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;

        // Player's Lives
        this.lives = 3;

        // Maximum Player's Health Points
        this.maxLives = 10;

        // Player's Speed
        this.speed = 10;

        this.image = document.querySelector('#player');

        // Jets
        this.jets = document.querySelector('#playerJets');

        // Player's Horizontal Frames
        this.frameX = 0;

        // Jet's Horizontal Frames
        this.jetsFrameX = 1;
    }

    // Draw Player's Model
    draw(context){
        //context.fillRect(this.x, this.y, this.width, this.height);

        // Handle player's sprite frames
        if(this.game.keys.indexOf('1') > -1){
            this.frameX = 1;
        } else {
            this.frameX = 0;
        }

        // Handle jet's sprite frames
        if(this.game.keys.indexOf('ArrowRight') > -1){
            this.jetsFrameX = 2;
        } else if (this.game.keys.indexOf('ArrowLeft') > -1) {
            this.jetsFrameX = 0
        } else {
            this.jetsFrameX = 1;
        }

        context.drawImage(this.jets, this.jetsFrameX * this. width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this. width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
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

    // Restart Player
    restart(){
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;
        this.lives = 3;
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
            context.save()
            context.fillStyle = 'blue';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.restore();
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
        this.x = 0;
        this.y = 0;
        this.positionX = positionX;
        this.positionY = positionY;
        this.markedForDeletion = false;
    }

    // Render Enemy
    draw(context){
        // context.strokeRect(this.x, this.y, this.width, this.height);

        // Draw Enemy Image
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    // Update enemies movement
    update(x, y){
        this.x = x + this.positionX;
        this.y = y + this.positionY;

        // Check collision between enemies and projectiles
        this.game.projectilesPool.forEach(projectile => {
            if(!projectile.free && this.game.checkCollision(this, projectile) && this.lives > 0){
                this.hit(1);

                // Reset projectiles when it hits enemy
                projectile.reset();

                // When enemy is destroyed scores increase by 1
                if(!this.game.gameOver) this.game.scores++;
                
            }
        });

        // When enemy destroyed trigger horizontal frames
        if(this.lives < 1){
            if(this.game.spriteUpdate) this.frameX++;

            if(this.frameX > this.maxFrame){
                this.markedForDeletion = true;
            }
        }

        // Check collision between enemies and player
        if(this.game.checkCollision(this, this.game.player)){
            this.markedForDeletion = true;

            // When collision decrease scores by 1
            if(!this.game.gameOver){
                this.game.scores -= 1;
                this.game.player.lives--;
            }

            if(this.game.player.lives < 1){
                this.game.gameOver = true;
            }
        } 

         // Lose Condition
         if(this.y + this.height > this.game.height){
            this.game.gameOver = true;
            this.markedForDeletion = true;
        }
  
    };

    // Change frameY when enemy gets hit 
    hit(damage){
        this.lives -= damage;
    }
}

// Beetlemorph Enemy Class
class Beetlemorph extends Enemy {
    constructor(game, positionX, positionY){
        super(game, positionX, positionY);
        this.image = document.querySelector('#beetlemorphEnemy');

        // Horizontal/Vertical Frames
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);

        // Max frames of the creatur
        this.maxFrame = 2;

        // Creature's health points
        this.lives = 1;
    }
}

// Rhinomorph Enemy Class
class Rhinomorph extends Enemy {
    constructor(game, positionX, positionY){
        super(game, positionX, positionY);
        this.image = document.querySelector('#rhinomorphEnemy');

        // Horizontal/Vertical Frames
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);

        // Max frames of the creature
        this.maxFrame = 5;

        // Creature's health points
        this.lives = 3;

        // Maximum creature's live. Using for frameX sprites to show that enemy damaged 
        this.maxLives = 3;
    }

    // Change frameX when enemy gets hit. 
    hit(damage){
        this.lives -= damage;
        this.frameX = this.maxLives - Math.floor(this.lives);
    }

}
// Boss Enemy Class
class Boss {
    constructor(game){
        this.image = document.querySelector('#bossEnemy');
        this.game = game;
        this.width = 200;
        this.height = 200;
        this.x = this.game.width * 0.5 - this.width * 0.5
        this.y = -this.height;
        this.speedX = Math.random() > 0.5 ? 1 : -1;
        this.speedY = 0;
        // Creature's health points
        this.lives = 10;

        // Maximum creature's live. Using for frameX sprites to show that enemy damaged 
        this.maxLives = this.lives;

        this.markedForDeletion = false;

        // Horizontal/Vertical Frames
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);

        // Max frames of the creature
        this.maxFrame = 11;
    }

    draw(context){
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(){
        if(this.y < 0) this.y += 10;
    }

    // Change frameX when enemy gets hit. 
    hit(damage){
        this.lives -= damage;
        this.frameX = this.maxLives - Math.floor(this.lives);
    }
}


class Wave {
    constructor(game){
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = -this.height;
        this.speedX = Math.random() < 0.5 ? 1 : -1;
        this.speedY = 0;
        this.markedForDeletion = false;

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

        if(this.enemies.length <= 0) this.markedForDeletion = true;
    }

    // Create array that contains wave of enemies
    create(){

        for(let y = 0; y < this.game.rows; y++){
            for(let x = 0; x < this.game.columns; x++){
                let enemyX = x * this.game.enemySize;
                let enemyY = y * this.game.enemySize;
                //this.enemies.push(new Beetlemorph(this.game, enemyX, enemyY))
                Math.random() > 0.8 
                            ? this.enemies.push(new Rhinomorph(this.game, enemyX, enemyY))
                            : this.enemies.push(new Beetlemorph(this.game, enemyX, enemyY))
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
        this.enemySize = 80;

        // Waves of enemies
        this.waves = [];
        //this.waves.push(new Wave(this));
        // Number of waves
        this.waveCount = 1;

        // Scores
        this.scores = 0;

        // Game over.
        this.gameOver = false;

        // Fired Projectile. Attack was pressed
        this.fired = false;

        // Sprite Update
        this.spriteUpdate = false;
        this.spriteTimer = 0;
        this.spriteInterval = 120;

        this.bossArray = [];
        this.restart();

        // Events

        // Add pressed key into the array
        window.addEventListener('keydown', (e) => {

            // Shoot Projectile
            if(e.key === '1' && !this.fired){
                this.player.shoot();
            }
            this.fired = true;

            if(this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key)
            }

            // Restart Game
            if(e.key.toLowerCase() === 'r' && this.gameOver){
                this.restart();
            }
        })

        // Remove pressed key into the array
        window.addEventListener('keyup', (e) => {
            
            const index =  this.keys.indexOf(e.key)

            if(index > -1){
                this.keys.splice(index, 1);
            }  

            this.fired = false;
        })
    
    }

    // Draw objects
    render(context, deltaTime){
        // Sprite Timing
        if(this.spriteTimer > this.spriteInterval){
            this.spriteUpdate = true;
            this.spriteTimer = 0;
        } else {
            this.spriteUpdate = false;
            this.spriteTimer += deltaTime;
        }

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

                // When wave of enemies is destroyed add 1 health point
                if(this.player.lives < this.player.maxLives) this.player.lives++;
                
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

        for(let i = 0; i < this.player.maxLives; i++){
            context.strokeRect(20 + 20 * i, 100, 10, 15);
        }

        for(let i = 0; i < this.player.lives; i++){
            context.fillRect(20 + 20 * i, 100, 10, 15);
        }

        // If game is over
        if(this.gameOver){
            context.textAlign = 'center';
            context.font = '100px Impact';
            context.fillText('GAME OVER', this.width * 0.5, this.height * 0.5);

            context.font = '20px Impact';
            context.fillText('Press R to restart', this.width * 0.5 + 30, this.height * 0.5 + 30);
        }
        context.restore();
    }


    // Waves Generation
    newWave(){
        if(Math.random() > 0.5 && this.columns * this.enemySize < this.width * 0.8){
            this.columns++;
        } else if(this.rows * this.enemySize < this.height * 0.6) {
            this.rows++;
        }  
        this.waves.push(new Wave(this))
        this.waves = this.waves.filter(wave => !wave.markedForDeletion)
    }

    // Restart Game
    restart(){
        // Restart Player
        this.player.restart();

        // Set default values
        this.columns = 3;
        this.rows = 3;

        // Waves of enemies
        this.waves = [];
        this.waves.push(new Wave(this));
        // Number of waves
        this.waveCount = 1;

        // Scores
        this.scores = 0;

        // Game over.
        this.gameOver = false;

        this.bossArray = [];

        this.bossArray.push(new Boss(this));
    }
}


window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas1');
    const context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 900;
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    context.lineWidth = 1;

    // Status text
    context.font = '30px Impact';

    const game = new Game(canvas);
    
    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;


        // Clear Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        game.render(context, deltaTime);
        window.requestAnimationFrame(animate);
    }
    animate(0);
});