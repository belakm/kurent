var gameStates = gameStates || {};

var bullets;
var player;
var emitter;

var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;

var map, groundLayer, backgroundLayer, backgroundMovinglayer;

var fireRate = 100;
var nextFire = 0;

gameStates.Level = {

    // We define the 3 default Phaser functions

    preload: function() {

        // That's where we load the game's assets
        game.load.image('btnEndIt','assets/buttons/endit.png');
        game.load.image('btnGameMenu','assets/buttons/gamemenu.png');

        //game.load.image('coin','assets/misc/coin.png');

        //game.load.image('player','assets/objects/player.png');
        game.load.spritesheet('player', 'assets/objects/kurent-hoja-2.png', 64, 128, 6);
		game.load.image('bullet', 'assets/objects/bullet.png');

        // LEVEL
        game.load.tilemap('tilemap', 'assets/level/level.json', null, Phaser.Tilemap.TILED_JSON);
	    game.load.image('tiles', 'assets/level/test.png');

        game.load.tilemap('tilemap2', 'assets/level/kurent-test-level-2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles2', 'assets/level/test-tileset-2.png');
        game.load.image('tiles3', 'assets/level/test-tileset-2-back.png');
        game.load.image('tiles4', 'assets/level/test-tileset-2-back-moving.png');
        //game.load.image('tiles', 'assets/level/test.png');

	    // BULLET SOUNDS
	    game.load.audio('bulletCollision', 'assets/sounds/bulletcollision.mp3');
	    game.load.audio('bulletFire', 'assets/sounds/bullet.mp3');

	    //game.load.audio('ambience', 'assets/sounds/darth-sidneyous-space-techrough-draft.mp3');
    },

    create: function() { 

    	//emitter = game.add.emitter(game.world.centerX, 200, 200);

	    //emitter.makeParticles('coin');

	    //	false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
	    //	The 5000 value is the lifespan of each particle
	    //emitter.start(false, 5000, 20);


    	bulletFire = game.add.audio('bulletFire', 0.03, false);

    	//ambientMusic = game.add.audio('ambience', 0.3, true);
    	//ambientMusic.play();

    	initLevel();
    	initControls();
    	initPlayer();
    },

    update: function() {
    	//playerCollision();

        playerMovement();
        playerDeath();

        gameButtons();
        moveBackground();
    },
};

var init = 0;
var playerinit = 362;
function moveBackground(){
    //backgroundMovinglayer.x = 0;
    //ba
}

function initLevel(){
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.stage.backgroundColor = "#a9f0ff";
	
	map = game.add.tilemap('tilemap2');
	map.addTilesetImage('test-tileset-2', 'tiles2');
    map.addTilesetImage('test-tileset-2-back', 'tiles3');
    map.addTilesetImage('test-tileset-2-back-moving', 'tiles4');

	//Add both the background and ground layers. We won't be doing anything with the
	//GroundLayer though
	backgroundLayer = map.createLayer('Background-moving');
    backgroundMovinglayer = map.createLayer('Background-fixed');
	groundLayer = map.createLayer('Ground');

    backgroundLayer.scrollFactorX = 0.5;

	//Change the world size to match the size of this layer
	groundLayer.resizeWorld();

	//map.setCollisionByExclusion([0], true, 'groundLayer');

	//Before you can use the collide function you need to set what tiles can collide
	map.setCollisionBetween(0,2, true,'Ground');

	tiles2 = game.physics.p2.convertTilemap(map, groundLayer, true, true);
    polygons = game.physics.p2.convertCollisionObjects(map,"Object");

	game.physics.p2.restitution = 0.1;
    game.physics.p2.gravity.y = 1000;

	buttonEnd = game.add.button(100, 50, 'btnEndIt', endGame, this, 2, 1, 0);
	buttonMenu = game.add.button(400, 50, 'btnGameMenu', pauseGame, this, 2, 1, 0);

	buttonEnd.fixedToCamera = true;
	buttonMenu.fixedToCamera = true;

	var text = "Level happening";
	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

	t = game.add.text(game.world.centerX-300, 100, text, style);
}

function initPlayer(){
	player = game.add.sprite(362, 362, 'player');
	game.physics.p2.enable(this.player);

	player.animations.add('walkRight', [0,1,2]);
	player.animations.add('walkLeft', [3,4,5]);

	player.frame = 0;
	
	player.body.fixedRotation = true;
	player.body.mass = 2;

    //Make the camera follow the sprite
	game.camera.follow(player);

	// BULLETS
    this.bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.P2JS;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('body.gravityScale', 0.1);
    bullets.setAll('onBeginContact', bulletHitWalls(this), this);

    game.physics.p2.setImpactEvents(true);

    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var bulletCollisionGroup = game.physics.p2.createCollisionGroup();

    game.physics.p2.updateBoundsCollisionGroup();

}

function initControls(){
	cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function playerMovement(){
	if (cursors.left.isDown)
    {
        player.body.moveLeft(200);
        player.animations.play('walkLeft', 12, false);

        if (facing != 'left')
        {
            //player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.moveRight(200);
        player.animations.play('walkRight', 12, false);

        if (facing != 'right')
        {
            facing = 'right';
        }
    }
    else
    {
        player.body.velocity.x = 0;

        if (facing == 'left') player.frame = 3;
        else if (facing == 'right') player.frame = 0;

        /*if (facing != 'idle')
        {
            //player.animations.stop();

            if (facing == 'left')
            {
                //player.frame = 0;
            }
            else
            {
                //player.frame = 5;
            }

            facing = 'idle';
        }*/
    }


    if (cursors.up.isDown && game.time.now > jumpTimer && checkIfCanJump()){
    	player.body.moveUp(600);
        jumpTimer = game.time.now + 750;
    }
    
    if (jumpButton.isDown)
    {
        fire();
    }
}


function checkIfCanJump() {

    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;

    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === player.body.data || c.bodyB === player.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === player.body.data) d *= -1;
            if (d > 0.5) result = true;
        }
    }
    
    return result;

}

function bulletHitWalls(bullet) {
    console.log(bullet);
    //bullet.kill();
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

        bulletFire.play();

        if (facing == 'left') {
        	bullet.reset(player.x-16, player.y+28);
        	bullet.body.moveLeft(1400);
        }
        else {
        	bullet.reset(player.x+16, player.y+28);
        	bullet.body.moveRight(1400);
        }
    }
}

function playerCollision(){
}


function playerDeath(){
	if (!player.inWorld) endGame();
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
