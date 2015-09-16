var gameStates = gameStates || {};

gameStates.End = {

    // We define the 3 default Phaser functions

    preload: function() {
        // That's where we load the game's assets
        game.load.image('btnRestart','assets/buttons/restart.png');
    },

    create: function() { 
    	game.world.width = 864;
    	game.world.height = 480;

    	game.stage.backgroundColor = '#182d3b';

    	buttonRestart = game.add.button(game.world.centerX - 100,  game.world.centerY + 80, 'btnRestart', restartGame, this, 2, 1, 0);

		var text = "Score screen";
	    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

	    var t = game.add.text(game.world.centerX-300, 100, text, style);
    },

    update: function() {
        
    },
};

function restartGame(){
	game.state.start('Start');
}