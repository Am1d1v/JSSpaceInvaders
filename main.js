

// Player Class. Movement and animation of the player character.
class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;

        // Player's Speed
        this.speed = 5;
    }

    // Draw Player's Model
    draw(context){
        context.fillRect(this.x, this.y, this.width, this.height)
    }

    // Update's Player's Data
    update(){

        // Update horizontal player position
        this.x += this.speed;
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
        context.clearRect(0, 0, this.width, this.height);

        game.render(context);
        window.requestAnimationFrame(animate);
    }
    animate();
});