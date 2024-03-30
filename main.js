

// Player Class. Movement and animation of the player character.
class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;

        // Player's Speed
        this.speed = 15;
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

        
    }
}

// Projectile Class. Player's shooting elements
class Projectile {

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

        // Events

        // Add pressed key into the array
        window.addEventListener('keydown', (e) => {
            
            if(this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key)
            }
            
            console.log(this.keys);
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