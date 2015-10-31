var gameStates = gameStates || {};

gameStates.Start = {

    // We define the 3 default Phaser functions

    preload: function() {
        // That's where we load the game's assets
        game.load.image('gumb','assets/buttons/gumb-trans.png');
        game.load.image('background','assets/buttons/menu.png');

        if (!game.device.desktop){
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        }
    },

    create: function() { 
        if (!game.device.desktop){ game.input.onDown.add(gofull, this); }
    	//game.world.width = 1280;
    	//game.world.height = 720;
        game.stage.backgroundColor = '#f3f3f3';

        backgroundImage = game.add.sprite(0, 0, 'background');
        backgroundImage.width = 1280;
        backgroundImage.height = 720;
        backgroundImage.blendMode = PIXI.blendModes.SATURATION;

    	buttonStart = game.add.button(game.world.centerX - 180, game.world.centerY - 60, 'gumb', startTheGame, this, 2, 1, 0);
        buttonStart.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        buttonStart.scale.set(3,3)

        var text = "START";

	    var style = { font: "65px fixedsys", fill: "#232323", align: "center" };

	    var t = game.add.text(game.world.centerX - 180 + 70, game.world.centerY - 60 + 20, text, style);
    },

    update: function() {
        
    },
};

function gofull() { game.scale.startFullScreen(false);}

function startTheGame(){
    game.stage.backgroundColor = '#f3f3f3';
	game.state.start('Level');
}