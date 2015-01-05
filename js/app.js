// Enemies our player must avoid
//Declare variables

var PLAYER_StrtX = 0,
    PLAYER_StrtY = 492,
    ENEMY_StrtX = -40,
    ENEMY_StrtY = [142, 225, 308, 391],
    ENEMY_Speed = [150, 200, 400, 500, 300,350],
    //PLAYER_MoveY = 85,
    //PLAYER_MoveX = 101,
    player_life = 3
    level = 1;
    
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = ENEMY_StrtX;
    this.y = ENEMY_StrtY[Math.floor(Math.random()*4)];
    this.speed = ENEMY_Speed[Math.floor(Math.random()*6)];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        if(this.x > 950)
        {
            this.x = ENEMY_StrtX;
            this.y = ENEMY_StrtY[Math.floor(Math.random()*4)];
            this.speed = ENEMY_Speed[Math.floor(Math.random()*6)];
        }
        this.x = this.x + (this.speed*dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Creating a new enemy object
var enemy = new Enemy();
var allEnemies = [enemy];



//This function checks the level of the game and generates bugs 
//accordingly by calling spawnEnemy function
function chkLevel() {
    if (level === 1)
        spawnEnemy(3);
    else if (level === 2)
        spawnEnemy(5);
};


//This function is called by chkLevel function 
//to create enemy bugs acc. to the game level
function spawnEnemy(n) {
    for (var i = 0; i < n; i++) {
        var createEnemy = new Enemy();
        allEnemies.push(createEnemy);
    }
};


chkLevel();//function invoke to chk the level of the game
//End Enemy functions

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


var Player = function(x,y,life) {
    this.sprite = 'images/char-boy.png';
    this.withMb = 'images/char-pink-girlMb.png';
    this.playerLife = 'images/life.png';
    this.sad = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.xSpeed = 100;
    this.ySpeed = 90;
    this.life = life;
  };

// Update the player's position
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    this.x * dt + this.xSpeed;
    this.y * dt + this.ySpeed;
};
//Renders player sprite on the canvas
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    var positionX = 0;
    for (var i = 1; i <= this.life; i++) {
        ctx.drawImage(Resources.get(this.playerLife), 5 + positionX, 50);
        positionX += 30;
    };
};

//This function resets the position of the player 
Player.prototype.resetPosition = function() {
    this.x = PLAYER_StrtX;
    this.y = PLAYER_StrtY;
    this.sprite = 'images/char-boy.png';
};
//This function reduces the life of 
//the player after collision with bug
Player.prototype.lossLife = function() {
    this.life-- ;
};


//This function moves the player around the 
//canvas based on the arrow keys pushed
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if (this.x < 5){  //goes off the canvas
                this.x = 800;
            } else {
                this.x -= this.xSpeed;
            }
            break;  
        case 'right':
            if (this.x > 750){  //goes off the canvas
                this.x = -5;
            } else {
                this.x += this.xSpeed;
            }
             break;
        case 'up':
            if (this.y < 1){  //goes off the canvas
            } else {
                this.y -= this.ySpeed;
            }
            break;
        case 'down':
            if(this.y > 450){  //goes off the canvas
            } else {
                this.y += this.ySpeed;
            }
            break;
        default :
                return;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Creating a new player object
var player = new Player(PLAYER_StrtX, PLAYER_StrtY, player_life);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
