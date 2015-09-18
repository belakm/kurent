var gameStates = gameStates || {};

var bullets;
var player;
var emitter;

var facing = 'right';
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
        //game.load.image('gumb','assets/buttons/gumb-trans.png');

        //game.load.image('coin','assets/misc/coin.png');

        // PLAYER
        game.load.spritesheet('player', 'assets/objects/kurent-sprite-optim.png', 30, 53, 12);

        // BULLET
		game.load.image('bullet', 'assets/objects/bullet.png');

        // FLOWERS
        game.load.spritesheet('flower1', 'assets/objects/zvoncek.png', 16, 16, 6);

        // LEVEL

        game.load.tilemap('tilemap2', 'assets/level/32/level32.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles2', 'assets/level/32/sprite_sheet-ground.png');
        game.load.image('tiles3', 'assets/level/32/sprite_sheet-background.png');
        game.load.image('tiles4', 'assets/level/32/sprite_sheet-scrolling.png');
        // GAME OBJECTS
        game.load.image('gameObjects', 'assets/level/32/obj-tilesheet.png');
        //game.load.image('tiles', 'assets/level/test.png');

	    // BULLET SOUNDS
	    game.load.audio('bulletHitWall', 'assets/sounds/bulletcollision.mp3');
	    game.load.audio('bulletFire', 'assets/sounds/bullet.mp3');

	    //game.load.audio('ambience', 'assets/sounds/darth-sidneyous-space-techrough-draft.mp3');
	    game.load.audio('iceCrash', 'assets/sounds/icecrash.mp3');
	    game.load.audio('winterydoomroom', 'assets/sounds/winterydoomroom.mp3');
    },

    create: function() { 

    	SCORE = 0;

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
        iceCrash = game.add.audio('iceCrash', 0.2, false);
        winterydoomroom = game.add.audio('winterydoomroom', 0.15, true);

    	//ambientMusic = game.add.audio('ambience', 0.3, true);
    	//ambientMusic.play();

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        tilesCollisionGroup   = this.physics.p2.createCollisionGroup();

        polygonCollisionGroup   = this.physics.p2.createCollisionGroup();

        playerCollisionGroup  = this.physics.p2.createCollisionGroup();

        bulletCollisionGroup   = this.physics.p2.createCollisionGroup();

        flowerCollisionGroup   = this.physics.p2.createCollisionGroup();

        initLevel();
    	initControls();
    	initPlayer();
        initFlowers();

        game.time.advancedTiming = true;
        game.physics.p2.updateBoundsCollisionGroup();

        winterydoomroom.play();
    },

    update: function() {
    	//playerCollision();

        
        playerMovement();

        playerDeath();

        updateScore();
    },

    render: function() {

        // Camera
        game.debug.text('FPS: ' + game.time.fps, game.width - 100, 14, "#00ff00"); 
        //game.debug.cameraInfo(game.camera, 32, 32, "#00ff00");

    }
};

function updateScore(){
	scoreBar.text = SCORE;
}

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
	map.addTilesetImage('sprite_sheet-ground', 'tiles2');
    map.addTilesetImage('sprite_sheet-background', 'tiles3');
    map.addTilesetImage('sprite_sheet-scrolling', 'tiles4');

	//Add both the background and ground layers. We won't be doing anything with the
	//GroundLayer though
    backgroundMovinglayer = map.createLayer('Background scrolling');
	backgroundLayer = map.createLayer('Background');
	groundLayer = map.createLayer('Ground');

    map.setCollisionBetween(0,50, true,'Ground');

    groundLayer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    backgroundMovinglayer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    backgroundLayer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    groundLayer.setScale(3, 3);
    backgroundMovinglayer.setScale(3, 3);
    backgroundLayer.setScale(3, 3);
    //goLayer.scale.set(2, 2);

    backgroundMovinglayer.scrollFactorX = 0.5;
    backgroundMovinglayer.scrollFactorY = 0.5;

	//Change the world size to match the size of this layer
	groundLayer.resizeWorld();

	//map.setCollisionByExclusion([0], true, 'groundLayer');

	//Before you can use the collide function you need to set what tiles can collide

    //polygons = game.physics.p2.convertCollisionObjects(map,"Object");

	game.physics.p2.restitution = 0.1;
    game.physics.p2.gravity.y = 1000;

    tiles2 = game.physics.p2.convertTilemap(map, groundLayer, true, true);

	buttonEnd = game.add.button(20, 20, 'gumb', endGame, this, 2, 1, 0);
    buttonMenu = game.add.button(170, 20, 'gumb', pauseGame, this, 2, 1, 0);

    var text = "DEATH";
    var buttonTextStyle = { font: "18px Arial", fill: "#232323", align: "center" };
    buttonDies = game.add.text(45, 33, text, buttonTextStyle);

    var text = "PAUSE";
    buttonPause = game.add.text(198, 33, text, buttonTextStyle);

	var text = "Level happening";
	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

	t = game.add.text(game.world.centerX-300, 100, text, style);

	var scoreStyle = { font: "64px Arial", fill: "#000", align: "right" };
	scoreBar = game.add.text(game.width - 80, 40, '0', scoreStyle);

	buttonEnd.fixedToCamera = true;
	buttonMenu.fixedToCamera = true;
	buttonDies.fixedToCamera = true;
	buttonPause.fixedToCamera = true;
	scoreBar.fixedToCamera = true;

    for (var i = 0; i < tiles2.length; i++) {
        var tileBody = tiles2[i];
        tileBody.setCollisionGroup(tilesCollisionGroup);
        tileBody.collides(playerCollisionGroup, collisionFloor);
        tileBody.collides(bulletCollisionGroup);
        tileBody.collides(flowerCollisionGroup);
    }

    //polygons.setCollisionGroup(polygonCollisionGroup);
}

function initPlayer(){

    playerGroup = game.add.group();
    map.createFromObjects('Game objects', 63, 'gameObjects', 0, true, false, playerGroup);
    console.log(playerGroup.children[0]);
    setupObjects(playerGroup.children[0]);

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

    for (var i = 0; i < bullets.children.length; i++) {
        var bulletBody = bullets.children[i].body;
        bulletBody.setCollisionGroup(bulletCollisionGroup);
        bulletBody.collides(tilesCollisionGroup, collisionBulletFloor);
        bulletBody.collides(polygonCollisionGroup);
    }
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
    map.createFromObjects('Game objects', 61, 'gameObjects', 0, true, false, flowers);
    flowers.forEach(setupObjects,this);

    console.log('tileset -> object transformation complete');
}
function setupObjects(object){

    if (object.name == 'player'){
        object.loadTexture('player', 0);
        object.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        object.scale.setTo(3,3);
        object.x = 3*object.x;
        object.y = 3*object.y;

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
        player.body.onBeginContact.add(kurentTouching,this);
  		player.body.onEndContact.add(kurentTouchingEnd, this);
  		game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    } else {
        object.loadTexture('flower1', 0);
        object.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        object.scale.setTo(3,3);
        object.x = 3*object.x;
        object.y = 3*object.y;

        object.nameType = 'flower';

        object.physicsBodyType = Phaser.Physics.P2JS;
        game.physics.p2.enable(object);

        object.body.data.shapes[0].sensor = true;

        object.animations.add('bloom');

        object.body.static = true;

        object.body.x = object.body.x + 32;
        object.body.y = object.body.y + 169;

        object.body.setCollisionGroup(flowerCollisionGroup);
	    //object.body.collides(tilesCollisionGroup);
	    object.body.collides(playerCollisionGroup);
	    object.body.onBeginContact.add(collisionFlower, this);

        console.log('seting up '+object.name, 'object: ', object);
    }
}

function initControls(){
	cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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

function kurentTouching (a, b, c, d){
	if (a.sprite != null && a.sprite.nameType == 'flower') return 0;
    player.touching = true;
    shakeWorld();
}
function kurentTouchingEnd (a, b, c, d){
	if (a.sprite != null && a.sprite.nameType == 'flower') return 0;
    player.touching = false;
}

function collisionFloor(){

}
function collisionBulletFloor(bullet){ // DETECTS BULLETS HITTING THE FLOOR
    killBullet(bullet.sprite)
    bulletHitWall.play();
}
function collisionFlower(a, b, c, d){
	var flower = c.body.parent.sprite;
    flower.body.clearCollision(playerCollisionGroup);
    flower.animations.play('bloom', 12, false);
    player.body.thrust(10);
    iceCrash.play();
    SCORE++;
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
	if (!player.inWorld) {
		endGame();
	}
}

function endGame(){
	winterydoomroom.destroy();
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

function shakeWorld(){
	
}