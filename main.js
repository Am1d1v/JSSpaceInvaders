

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
            projectile.start(this.x, this.y);
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
    }

    // Shoot projectile
    start(x, y){
        this.x = x;
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
        this.player.draw(context);
        this.player.update();
        this.projectilesPool.forEach(projectile => {
            projectile.update();
            projectile.draw(context);
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
    
}


window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas1');
    const context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 900;

    const game = new Game(canvas);
    

    function animate(){
        // Clear Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        game.render(context);
        window.requestAnimationFrame(animate);
    }
    animate();
});