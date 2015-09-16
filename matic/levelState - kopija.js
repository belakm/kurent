var gameStates = gameStates || {};

var bullets;
var sprite;
var emitter;

var fireRate = 100;
var nextFire = 0;

gameStates.Level = {

    // We define the 3 default Phaser functions

    preload: function() {
        // That's where we load the game's assets
        game.load.image('btnEndIt','assets/buttons/endit.png');
        game.load.image('btnGameMenu','assets/buttons/gamemenu.png');

        //game.load.image('coin','assets/misc/coin.png');

        game.load.image('player','assets/objects/player.png');
		game.load.image('bullet', 'assets/objects/bullet.png');

        // LEVEL
        game.load.tilemap('tilemap', 'assets/level/level.json', null, Phaser.Tilemap.TILED_JSON);
	    game.load.image('tiles', 'assets/level/test.png');
    },

    create: function() { 

    	//emitter = game.add.emitter(game.world.centerX, 200, 200);

	    //emitter.makeParticles('coin');

	    //	false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
	    //	The 5000 value is the lifespan of each particle
	    //emitter.start(false, 5000, 20);

    	initLevel();
    	initControls();
    	initPlayer();
    },

    update: function() {
    	playerCollision();
        playerMovement();
        playerDeath();

        gameButtons();
    },
};

function initLevel(){
	game.physics.startSystem(Phaser.Physics.NINJA);
	game.stage.backgroundColor = "#a9f0ff";
	
	this.map = game.add.tilemap('tilemap');
	this.map.addTilesetImage('test', 'tiles');

	//Add both the background and ground layers. We won't be doing anything with the
	//GroundLayer though
	this.backgroundlayer = this.map.createLayer('backgroundLayer');
	this.groundLayer = this.map.createLayer('groundLayer');

	//Before you can use the collide function you need to set what tiles can collide
	this.map.setCollisionBetween(1, 50, true, 'groundLayer');

	//Change the world size to match the size of this layer
	this.groundLayer.resizeWorld();

	var slopeMap = [0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
	this.tiles = game.physics.ninja.convertTilemap(this.map, this.groundLayer, slopeMap);

	buttonEnd = game.add.button(100, 50, 'btnEndIt', endGame, this, 2, 1, 0);
	buttonMenu = game.add.button(400, 50, 'btnGameMenu', pauseGame, this, 2, 1, 0);

	buttonEnd.fixedToCamera = true;
	buttonMenu.fixedToCamera = true;

	var text = "Level happening";
	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

	t = game.add.text(game.world.centerX-300, 100, text, style);
}

function initPlayer(){
	//Add the sprite to the game and enable arcade physics on it
	this.sprite = game.add.sprite(74, game.world.centerY, 'player');
	sprite = this.sprite;
	this.game.physics.ninja.enable(this.sprite);

	//Set some physics on the sprite
    this.sprite.body.maxSpeed = 8;
    this.sprite.body.friction = 0.9;
    this.sprite.body.bounce = 0;
    this.sprite.body.collideWorldBounds = false;
    this.game.physics.ninja.gravity = 0.5;

    //Make the camera follow the sprite
	game.camera.follow(this.sprite);

	// BULLETS
    this.bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.NINJA;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('body.gravityScale', 0.1);
}

function initControls(){
	cursors = game.input.keyboard.createCursorKeys();
}

function playerMovement(){
	// If the left arrow key is pressed
	if (cursors.left.isDown && sprite.body.touching.down) {
	    // Move the player to the left
	    sprite.body.moveLeft(80);
	} else if (cursors.left.isDown){
		sprite.body.moveLeft(8);  
	}

	// If the right arrow key is pressed
	if (cursors.right.isDown && sprite.body.touching.down) {
	   	// Move the player to the right
	   	sprite.body.moveRight(80);
	} else if (cursors.right.isDown){
		sprite.body.moveRight(8);
	}

	// If the up arrow key is pressed and the player is touching the ground
	if (cursors.up.isDown && sprite.body.touching.down) {
	   	// Move the player upward (jump)
	    sprite.body.moveUp(1000);	
	} else if (cursors.up.isDown) {
		sprite.body.moveUp(10);
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fire();
        //particleBurst();
    }
}

function wallHit(bullet){
	killBullet(bullet);
}
function killBullet(bullet){
	//game.add.tween(bullet).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);

	var tween = game.add.tween(bullet);
	tween.to({ alpha: 0 }, 100, Phaser.Easing.Linear.None);
	tween.onComplete.add(function () {
        bullet.kill();
        bullet.alpha = 1;
    });
    tween.start();

	//game.time.events.add(Phaser.Timer.SECOND * 0.3, bullet.destroy());
	//bullet.destroy();
}

function fire() {
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(sprite.x, sprite.y);

        bullet.body.moveRight(400);
    }
}

function playerCollision(){
	for (var i = 0; i < this.tiles.length; i++)
    {
        this.sprite.body.aabb.collideAABBVsTile(this.tiles[i].tile);
        for (var j = 0; j < bullets.children.length; j++){
        	bullets.children[j].body.aabb.collideAABBVsTile(this.tiles[i].tile);
        	if (bullets.children[j].body.touching.right || bullets.children[j].body.touching.left) wallHit(bullets.children[j]);
        }
    }
}


function playerDeath(){
	if (sprite.body.y - 480 > 0) endGame();
}

function gameButtons(){

}

function endGame(){
	game.state.start('End');
}
function pauseGame(){
	game.paused = true;
	t.text = "Level paused";
	game.input.onDown.add(unPause, self);
}
function unPause(){
	t.text = "Level happening";
	game.paused = false;
}
