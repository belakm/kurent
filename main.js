var gameStates = gameStates || {};

game = new Phaser.Game(864, 480, Phaser.AUTO, '');

game.state.add('Start', gameStates.Start);
game.state.add('Level', gameStates.Level);
game.state.add('End', gameStates.End);

game.state.start('Start');