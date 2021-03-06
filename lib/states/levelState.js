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

    preload: function() {

        // That's where we load the game's assets
        //game.load.image('gumb','assets/buttons/gumb-trans.png');

        //game.load.image('coin','assets/misc/coin.png');
        if (!game.device.desktop){
            game.load.image('buttonMobileLeft','assets/buttons/mobile_left.png');
            game.load.image('buttonMobileRight','assets/buttons/mobile_right.png');
            game.load.image('buttonMobileJump','assets/buttons/mobile_jump.png');
            game.load.image('buttonMobileShoot','assets/buttons/mobile_shoot.png');
        }
        

        // PLAYER
        game.load.spritesheet('player', 'assets/objects/kurent-sprite-optim.png', 30, 53, 12);

        // BULLET
		game.load.image('bullet', 'assets/objects/bullet.png');

		// SNOWFLAKE
		game.load.spritesheet('snowflake', 'assets/misc/snowflake.jpg');

        // FLOWERS
        game.load.spritesheet('flower1', 'assets/objects/zvoncek.png', 16, 16, 6);

        // ICICLES
        game.load.image('icicle', 'assets/objects/sveca.png');

        // ENEMY - VOLKODLAK
        game.load.spritesheet('volkodlak', 'assets/objects/volkodlak.png', 34, 35, 4);
        // ENEMY - DEAD VOLKODLAK
        game.load.spritesheet('skull', 'assets/objects/volkodlak-lobanja.png', 21, 21, 8);
        // BLOOD PIXEL
        game.load.image('blooxPX', 'assets/misc/blood.jpg');

        // LEVEL TILEMAPS
        game.load.tilemap('tilemap2', 'assets/level/32/level32.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles2', 'assets/level/32/sprite_sheet-ground.png');
        game.load.image('tiles3', 'assets/level/32/sprite_sheet-background.png');
        game.load.image('tiles4', 'assets/level/32/sprite_sheet-scrolling.png');

        // GAME OBJECTS TILEMAP
        game.load.image('gameObjects', 'assets/level/32/obj-tilesheet.png');
        //game.load.image('tiles', 'assets/level/test.png');

	    // BULLET SOUNDS
	    game.load.audio('bulletHitWall', 'assets/sounds/bulletcollision.mp3');
	    game.load.audio('bulletFire', 'assets/sounds/bullet.mp3');

        // ZVONCEK
	    game.load.audio('zvoncek1', 'assets/sounds/zvoncek1.ogg');
        game.load.audio('zvoncek2', 'assets/sounds/zvoncek2.ogg');
        game.load.audio('zvoncek3', 'assets/sounds/zvoncek3.ogg');
        game.load.audio('zvoncek4', 'assets/sounds/zvoncek4.ogg');

        // BACKGROUND MUSIC
	    //game.load.audio('winterydoomroom', 'assets/sounds/winterydoomroom.mp3');
        //game.load.audio('ambience', 'assets/sounds/darth-sidneyous-space-techrough-draft.mp3');
    },

    create: function() { 

        // reset var
    	SCORE = 0;
        LIVES = 5;
        facing = 'right';
        jumpTimer = 0;

        game.input.gamepad.start();
        pad = game.input.gamepad.pad1;
        pad.addCallbacks(this, { onConnect: addButtons });

    	//ambientMusic = game.add.audio('ambience', 0.3, true);
    	//ambientMusic.play();

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        tilesCollisionGroup = this.physics.p2.createCollisionGroup();
        polygonCollisionGroup = this.physics.p2.createCollisionGroup();
        playerCollisionGroup = this.physics.p2.createCollisionGroup();
        volkodlakCollisionGroup = this.physics.p2.createCollisionGroup();
        bulletCollisionGroup = this.physics.p2.createCollisionGroup();
        flowerCollisionGroup = this.physics.p2.createCollisionGroup();
        icicleCollisionGroup = this.physics.p2.createCollisionGroup();

        initMusic();
        initLevel();
    	initControls();
    	initPlayer();
        initVolkodlak();
        initFlowers();
        initIcicles();

        //initSnow();

        game.time.advancedTiming = true;
        game.physics.p2.updateBoundsCollisionGroup();

        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

        // INTRO MUSIC
        //winterydoomroom.play();
    },

    update: function() {
    	//playerCollision();
        playerMovement();
        updateObjects();
        updateLives();
        updateScore();
        playerDeath();
    },

    render: function() {

        // Camera
        game.debug.text('FPS: ' + game.time.fps, game.width - 100, 14, "#00ff00");

    }
};

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