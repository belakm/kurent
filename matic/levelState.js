var gameStates = gameStates || {};

var bullets;
var player;
var emitter;
var enemy;
var hp = 10;


var facing = 'right';
var enemy_facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;

var playerReleasedKey = true;

var map, groundLayer, backgroundLayer, backgroundMovinglayer;

var fireRate = 100;
var nextFire = 0;

var pad;

var buttonA;
var buttonB;
var buttonX;
var buttonY;
var buttonDPadLeft;
var buttonDPadRight;
var buttonDPadUp;
var buttonDPadDown;

gameStates.Level = {

    // We define the 3 default Phaser functions

    preload: function() {

        // That's where we load the game's assets
        game.load.image('btnEndIt','assets/buttons/endit.png');
        game.load.image('btnGameMenu','assets/buttons/gamemenu.png');

        //game.load.image('coin','assets/misc/coin.png');

        // PLAYER
        game.load.spritesheet('player', 'assets/objects/kurent-sprite.png', 30, 53, 12);
		
		// ENEMY
		game.load.spritesheet('enemy', 'assets/objects/sovrag-sprite-optim.png', 30, 53, 12);

        // BULLET
		game.load.image('bullet', 'assets/objects/bullet.png');

        // FLOWERS
        game.load.spritesheet('flower1', 'assets/objects/zvoncek-manjsi.png', 32, 32, 6);

        // LEVEL

        game.load.tilemap('tilemap2', 'assets/level/kurent-test-level-2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles2', 'assets/level/test-tileset-2.png');
        game.load.image('tiles3', 'assets/level/test-tileset-2-back.png');
        game.load.image('tiles4', 'assets/level/test-tileset-2-back-moving.png');
        // GAME OBJECTS
        game.load.image('gameObjects', 'assets/level/obj-tilesheet.png');
        //game.load.image('tiles', 'assets/level/test.png');

	    // BULLET SOUNDS
	    game.load.audio('bulletHitWall', 'assets/sounds/bulletcollision.mp3');
	    game.load.audio('bulletFire', 'assets/sounds/bullet.mp3');

	    //game.load.audio('ambience', 'assets/sounds/darth-sidneyous-space-techrough-draft.mp3');
    },

    create: function() { 

        game.input.gamepad.start();
        pad = game.input.gamepad.pad1;
        pad.addCallbacks(this, { onConnect: addButtons });

    	//emitter = game.add.emitter(game.world.centerX, 200, 200);

	    //emitter.makeParticles('coin');

	    //	false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
	    //	The 5000 value is the lifespan of each particle
	    //emitter.start(false, 5000, 20);


    	bulletFire = game.add.audio('bulletFire', 0.03, false);
        bulletHitWall = game.add.audio('bulletHitWall', 0.03, false);

    	//ambientMusic = game.add.audio('ambience', 0.3, true);
    	//ambientMusic.play();

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        tilesCollisionGroup   = this.physics.p2.createCollisionGroup();

        polygonCollisionGroup   = this.physics.p2.createCollisionGroup();

        playerCollisionGroup  = this.physics.p2.createCollisionGroup();
		
		enemyCollisionGroup = this.physics.p2.createCollisionGroup();

        bulletCollisionGroup   = this.physics.p2.createCollisionGroup();

        flowerCollisionGroup   = this.physics.p2.createCollisionGroup();

    	initLevel();
    	initControls();
    	initPlayer();
        initFlowers();
		initEnemy();

        game.time.advancedTiming = true;
        game.physics.p2.updateBoundsCollisionGroup();

        // GAMEPAD INPUT
    },

    update: function() {
    	//playerCollision();

        
        playerMovement();
		//enemyMovement();
        playerDeath();
    },

    render: function() {

        // Camera
        game.debug.text('FPS: ' + game.time.fps, 32, 14, "#00ff00"); 
        game.debug.cameraInfo(game.camera, 32, 32, "#00ff00");

    }
};

function addButtons(){
    //  We can't do this until we know that the gamepad has been connected and is started

    console.log('gamepad connected');

    buttonA = pad.getButton(Phaser.Gamepad.XBOX360_A);
    buttonB = pad.getButton(Phaser.Gamepad.XBOX360_B);
    buttonX = pad.getButton(Phaser.Gamepad.XBOX360_X);
    buttonY = pad.getButton(Phaser.Gamepad.XBOX360_Y);

    buttonA.onDown.add(onDown, this);
    buttonB.onDown.add(onDown, this);
    buttonX.onDown.add(onDown, this);
    buttonY.onDown.add(onDown, this);

    buttonA.onUp.add(onUp, this);
    buttonB.onUp.add(onUp, this);
    buttonX.onUp.add(onUp, this);
    buttonY.onUp.add(onUp, this);

    //  These won't work in Firefox, sorry! It uses totally different button mappings

    buttonDPadLeft = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
    buttonDPadRight = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
    buttonDPadUp = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
    buttonDPadDown = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);

    buttonDPadLeft.onDown.add(onDown, this);
    buttonDPadRight.onDown.add(onDown, this);
    buttonDPadUp.onDown.add(onDown, this);
    buttonDPadDown.onDown.add(onDown, this);

    buttonDPadLeft.onUp.add(onUp, this);
    buttonDPadRight.onUp.add(onUp, this);
    buttonDPadUp.onUp.add(onUp, this);
    buttonDPadDown.onUp.add(onUp, this);
}

var gamePadButtons = {
    A : false,
    B : false,
    X : false,
    Y : false,
    down: false,
    up: false,
    left: false,
    right: false
}

function onDown(button, value) {
    console.log(button);
    if (button.buttonCode === Phaser.Gamepad.XBOX360_A)
    {
        gamePadButtons.A = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_B)
    {
        gamePadButtons.B = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
    {
        gamePadButtons.X = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_Y)
    {
        gamePadButtons.Y = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT)
    {
        gamePadButtons.left = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT)
    {
        gamePadButtons.right = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_UP)
    {
        gamePadButtons.up = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_DOWN)
    {
        gamePadButtons.down = true;
    }
}
function onUp(button, value) {
    if (button.buttonCode === Phaser.Gamepad.XBOX360_A)
    {
        gamePadButtons.A = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_B)
    {
        gamePadButtons.B = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
    {
        gamePadButtons.X = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_Y)
    {
        gamePadButtons.Y = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT)
    {
        gamePadButtons.left = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT)
    {
        gamePadButtons.right = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_UP)
    {
        gamePadButtons.up = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_DOWN)
    {
        gamePadButtons.down = false;
    }
}

function initLevel(){
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
    backgroundLayer.scrollFactorY = 0.5;

	//Change the world size to match the size of this layer
	groundLayer.resizeWorld();

	//map.setCollisionByExclusion([0], true, 'groundLayer');

	//Before you can use the collide function you need to set what tiles can collide
	map.setCollisionBetween(0,50, true,'Ground');

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

    for (var i = 0; i < tiles2.length; i++) {
        var tileBody = tiles2[i];
        tileBody.setCollisionGroup(tilesCollisionGroup);
        tileBody.collides(playerCollisionGroup, collisionFloor);
        tileBody.collides(bulletCollisionGroup);
		tileBody.collides(enemyCollisionGroup);
    }

    //polygons.setCollisionGroup(polygonCollisionGroup);
}

function initPlayer(){

    playerGroup = game.add.group();
    map.createFromObjects('Game Objects', 146, 'gameObjects', 0, true, false, playerGroup);
    console.log(playerGroup.children[0]);
    setupObjects(playerGroup.children[0]);

    //Make the camera follow the sprite
	game.camera.follow(player);

	// BULLETS
    this.bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.P2JS;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('body.data.gravityScale', 0);

    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides(tilesCollisionGroup);
    player.body.collides(polygonCollisionGroup);
    player.body.collides(flowerCollisionGroup);
	player.body.collides(enemyCollisionGroup);

    for (var i = 0; i < bullets.children.length; i++) {
        var bulletBody = bullets.children[i].body;
        bulletBody.setCollisionGroup(bulletCollisionGroup);
        bulletBody.collides(tilesCollisionGroup, collisionBulletFloor);
		bulletBody.collides(enemyCollisionGroup, collisionBulletEnemy);
        bulletBody.collides(polygonCollisionGroup);
    }

    player.body.onBeginContact.add(kurentTouching,this);
    player.body.onEndContact.add(kurentTouchingEnd, this);
}

function initEnemy(){
	console.log("init enemy()");
	enemyGroup = game.add.group();

	map.createFromObjects('Game Objects', 147, 'gameObjects', 0, true, false, enemyGroup);
	
	enemyGroup.forEach(setupObjects,this);
	
	
}
function initFlowers(){
    /*flower1 = game.add.sprite(768, 560, 'flower1');
    game.physics.p2.enable(flower1);

    flower1.body.static = true;

    flower1.animations.add('bloom');

    flower1.body.setCollisionGroup(flowerCollisionGroup);
    flower1.body.collides(playerCollisionGroup, collisionFlower);*/

    console.log('init object transformation from tileset');

    flowers = game.add.group();
    flowers.enableBody = true;
    flowers.physicsBodyType = Phaser.Physics.P2JS;
    map.createFromObjects('Game Objects', 145, 'gameObjects', 0, true, false, flowers);
    flowers.forEach(setupObjects,this);

    console.log('tileset -> object transformation complete');
}
function setupObjects(object){

    if (object.name == 'player'){
		console.log("setupObjects player");
        object.loadTexture('player', 0);
        object.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        object.scale.setTo(3,3);

        game.physics.p2.enable(object);

        player = object;
        
        //player.body.setSize(64,128);

        player.animations.add('walk', [0,1,2,3], 12, false);
        player.animations.add('stay', [4,5,6,7], 6, true);
        player.animations.add('jump', [8,9,10,11], 12, true);

        player.frame = 0;
        
        player.body.fixedRotation = true;
        player.body.mass = 2;

        player.touching = false;
	}
	else if(object.name == 'enemy'){
		console.log("setupObjects enemy");
		object.loadTexture('enemy', 0);
        object.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        object.scale.setTo(3,3);
        game.physics.p2.enable(object);
		
		enemy = object;
		
		enemy.animations.add('walk', [0,1,2,3], 12, false);
        enemy.animations.add('stay', [4,5,6,7], 6, true);
        enemy.animations.add('jump', [8,9,10,11], 12, true);
		
		
		
		enemy.body.setCollisionGroup(enemyCollisionGroup);
		enemy.body.collides(tilesCollisionGroup);
		enemy.body.collides(bulletCollisionGroup, collisionBulletEnemy);
		enemy.body.collides(playerCollisionGroup, collisionPlayerEnemy);
		enemy.body.mass = 2;
		enemy.body.fixedRotation = true;
        enemy.touching = false;
    }

	
    else {
        object.loadTexture('flower1', 0);
        game.physics.p2.enable(object);

        object.animations.add('bloom');
        object.body.static = true;
        object.body.x = object.x+32;
        object.body.y = object.y+48;

        object.body.setCollisionGroup(flowerCollisionGroup);
        object.body.collides(playerCollisionGroup, collisionFlower);
        console.log('seting up '+object.name, 'object: ', object);
    }
}

function initControls(){
	cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function enemyMovement(){
	enemy.body.moveLeft(50);
	
	if(enemy_facing != 'left')
		facing = 'left';
	
	if(enemy.touching) enemy.animations.play('walk');
}

function playerMovement(){
	if (cursors.left.isDown || gamePadButtons.left)
    {
        player.body.moveLeft(200);
        player.scale.x = -3; //flipped
        
        if (facing != 'left')
        {
            //player.animations.play('left');
            facing = 'left';
        }

        if (player.touching) player.animations.play('walk');
    }
    else if (cursors.right.isDown || gamePadButtons.right)
    {
        player.body.moveRight(200);
        player.scale.x = 3; //flipped
       

        if (facing != 'right')
        {
            facing = 'right';
        }

        if (player.touching) player.animations.play('walk');
    }
    else
    {
        player.body.velocity.x = 0;

        player.animations.play('stay');
    }


    if ((cursors.up.isDown || gamePadButtons.B) && game.time.now > jumpTimer && playerReleasedKey && player.touching){
    	player.body.moveUp(520);
        jumpTimer = game.time.now + 750;
        playerReleasedKey = false;
        player.animations.play('jump');
    } else if ((cursors.up.isDown || gamePadButtons.B) && !player.touching){
        player.body.thrust(1000);
        playerReleasedKey = false;
        player.animations.play('jump');
    } else if (!player.touching){
        player.animations.play('jump');
    }

    if (!(cursors.up.isDown || gamePadButtons.B)) {
        playerReleasedKey = true;
    }
    
    if (jumpButton.isDown || gamePadButtons.Y)
    {
        fire();
    }
}

function kurentTouching (a, b){
    player.touching = true;
}
function kurentTouchingEnd (a, b){
    player.touching = false;
}

function collisionFloor(){

}
function collisionBulletFloor(bullet){ // DETECTS BULLETS HITTING THE FLOOR
    killBullet(bullet.sprite)
    bulletHitWall.play();
}
function collisionFlower(flower){
    flower.sprite.animations.play('bloom', 12, false);
    flower.sprite.body.clearCollision(playerCollisionGroup);
}

function collisionPlayerEnemy(enemy){
	console.log("player enemy collision");
	hp-=1.5;
	console.log("HP = " + hp);
}

function collisionBulletEnemy(enemy, bullet){
	console.log("bullet enemy collision");
	killBullet(bullet.sprite);
	enemy.kill;
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

function killBullet(bullet){
	var tween = game.add.tween(bullet);
	tween.to({ alpha: 0 }, 100, Phaser.Easing.Linear.None);
	tween.onComplete.add(function () {
        bullet.kill();
        bullet.alpha = 1;
    });
    tween.start();
}

function fire() {
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bulletFire.play();

        if (facing == 'left') {
        	bullet.reset(player.x-20, player.y+20);
        	bullet.body.moveLeft(1400);
        }
        else {
        	bullet.reset(player.x+20, player.y+20);
        	bullet.body.moveRight(1400);
        }
    }
}

function playerCollision(){
}


function playerDeath(){
	if (!player.inWorld) endGame();
	if (hp <= 0)
	{
		hp = 10;
		endGame();
	}

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
