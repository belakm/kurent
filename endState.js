var gameStates = gameStates || {};

gameStates.End = {

    // We define the 3 default Phaser functions

    preload: function() {
        // That's where we load the game's assets
        //game.load.image('btnRestart','assets/buttons/gumb-trans.png');
    },

    create: function() { 
    	game.world.width = 864;
    	game.world.height = 480;

    	game.stage.backgroundColor = '#ff0022';

        backgroundImage = game.add.sprite(0, 0, 'background');
        backgroundImage.width = 1280;
        backgroundImage.height = 720;
        backgroundImage.blendMode = PIXI.blendModes.MULTIPLY;

    	buttonReStart = game.add.button(game.world.centerX - 180, game.world.centerY + 60, 'gumb', startTheGame, this, 2, 1, 0);
        buttonReStart.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        buttonReStart.scale.set(3,3)

        var text = "RESTART";

        var style = { font: "65px Arial", fill: "#232323", align: "center" };

        var t = game.add.text(game.world.centerX - 180 + 20, game.world.centerY + 80, text, style);

        buttonStartAnew = game.add.button(game.world.centerX - 180, game.world.centerY -100, 'gumb', restartGame, this, 2, 1, 0);
        buttonStartAnew.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        buttonStartAnew.scale.set(3,3)

        var text = "MENU";

        var style = { font: "65px Arial", fill: "#232323", align: "center" };

        var t = game.add.text(game.world.centerX - 180 + 90, game.world.centerY -80, text, style);

        var scoreText = "Score: " + SCORE;
        var scoreStyle = { font: "64px Arial", fill: "#fff", align: "right" };
        scoreEnd = game.add.text(game.world.centerX - 100, 150, scoreText, scoreStyle);
    },

    update: function() {
        
    },
};

function restartGame(){
	game.state.start('Start');
    game.stage.backgroundColor = '#f3f3f3';
}