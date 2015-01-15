/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        gemsCollected = 0,
        winFlag = 1,
        lostFlag = 1,
        soundFx = new Audio("music/scrap-brain-zone.mp3");
        bite = new Audio("music/bite.wav");
        stopMusic = "false";

    canvas.width = 909;
    canvas.height = 680;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    
    function init() {
        reset();
        lastTime = Date.now();
        main();
        addButton();
    };
    
    function addButton() {
    	var btn = document.createElement("BUTTON");
    	var t = document.createTextNode("Stop Music!");
    	btn.appendChild(t);
    	btn.appendChild(t);
    	document.body.appendChild(btn);
    	btn.onclick = function() {
    		playBckgrndMusic("true");
    	};
    }; 
   
    //This function plays background music in a loop until game is over
    function playBckgrndMusic(stpMsc) {
    	stopMusic = stpMsc; 
         if(stopMusic === "false") {
	            soundFx.loop = true;
	            soundFx.play(); 
	     } else if(stopMusic === "true") {  
        		soundFx.pause();
        	}
    };
    
    //This is the function call to playBckgrndMusic
    playBckgrndMusic("false");
          
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    
    function update(dt) {
        updateEntities(dt);
        bugCollision();
        collectBlueGem();
        gameOver();
        winner();
    };

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    };
    
    //This function checks the collision for bug with the player
    function bugCollision() {
        for (var i = 0; i < allEnemies.length; i++) {
            if(collide(player,allEnemies[i],40)) {
                player.resetPosition();
                player.lossLife();
                blueGem.resetPosition();
                bite.play();
            }
        }
    };
        
    //This function lets the player to 'collect' the gem : 
    //Calls collideGem and if true, calls the below functions 
    //including tracking the number of trophies won
    function collectBlueGem() {
        if (collideGem(player, blueGem, 30)) {
            blueGem.hide();
            blueGem.winTrophy();
            blueGem.resetPosition();
            player.resetPosition();
            gemsCollected++;
        }
   };
 
    //This function checks for collision during the game between any two entities 
    function collide(player,entity,theta) {
        if((entity.x >= (player.x - theta - 20)) && (entity.x <= (player.x + theta + 30))) {
            if ((entity.y >= (player.y - theta + 20)) && (entity.y <= (player.y + theta - 15))){
                return true;
            }
        }
    };
    
    //This function checks for collision during the game between the player and the gem 
    function collideGem(player,entity,theta) {
        if((entity.x >= (player.x - theta - 20)) && (entity.x <= (player.x + theta + 30))) {
            if ((entity.y >= (player.y - theta + 20)) && (entity.y <= (player.y + theta + 70))){
                return true;
            }
        }
    };
      
    //This detects the game over, when there are no more player lives left (3 allowed)
    function gameOver() {
        if(player.life === 0) {
            enemy.speed = 0;
            player.speed = 0;
            player.sprite = player.sad;
            player.x = 410;
            player.y = 240;
            allEnemies = [];
            blueGem.hide();
            ctx.font = "35px Arial";
            ctx.fillStyle = "red";
            playBckgrndMusic("true");
            ctx.fillText("Game Over. You collected " + gemsCollected + " out of 5 gems.", 150, 30);
            if(lostFlag === 1) {
                lostFlag++;
            }
        }
    };
       
    //This function announces the winner with 
    //meme text when the conditions are met: minimum feed set to five gem captures 
    function winner() {
        if((gemsCollected === 5) && (player.life)) {
            enemy.speed = 0;
            player.speed = 0;
            player.x = 410;
            player.y = 45;
            allEnemies = [];
            blueGem.hide();
            ctx.font = "35px Arial";
            ctx.fillStyle = "Blue";
            playBckgrndMusic("true");
            ctx.fillText("You Won! You collected all " + gemsCollected + " gems!", 200, 30);
            if(winFlag === 1) {
                winFlag++;
            }
        }
    }; 

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
        		'images/grass-block.png',	// Row 1 of 2 grass
                'images/grass-block.png',   // Row 2 of 2 grass
                'images/stone-block.png',   // Row 1 of 4 of stone
                'images/stone-block.png',   // Row 2 of 4 of stone
                'images/stone-block.png',   // Row 3 of 4 of stone
                'images/stone-block.png',   // Row 4 of 4 of grass
                'images/grass-block.png'    // Row 1 of 1 of grass
            ],
            numRows = 7,
            numCols = 9,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        blueGem.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-pink-girlMb.png',
        'images/char-pink-girl.png',
        'images/life.png',
        'images/char-pink-girl-sad.png',
        'images/char-boy-life.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Gem Blue Small.png',
        'images/Gem Green Small.png',
        'images/Gem Orange Small.png'
    ]);
    
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    
    global.ctx = ctx;
})(this);
