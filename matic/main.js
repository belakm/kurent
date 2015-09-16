var gameStates = gameStates || {};

game = new Phaser.Game('100%', '100%', Phaser.AUTO, '');

//game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

game.state.add('Start', gameStates.Start);
game.state.add('Level', gameStates.Level);
game.state.add('End', gameStates.End);

game.state.start('Start');