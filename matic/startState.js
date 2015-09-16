var gameStates = gameStates || {};

gameStates.Start = {

    // We define the 3 default Phaser functions

    preload: function() {
        // That's where we load the game's assets
        game.load.image('btnStart','assets/buttons/start.png');
    },

    create: function() { 
    	game.world.width = 864;
    	game.world.height = 480;
    	game.stage.backgroundColor = '#182d3b';

    	buttonStart = game.add.button(game.world.centerX - 100, game.world.centerY + 80, 'btnStart', startTheGame, this, 2, 1, 0);

		var text = "Startmenu";
	    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

	    var t = game.add.text(game.world.centerX-300, 100, text, style);
    },

    update: function() {
        
    },
};

function startTheGame(){
	game.state.start('Level');
}