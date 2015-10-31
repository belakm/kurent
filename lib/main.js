var gameStates = gameStates || {};

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

//var maxPovecava = 

var ratio = 16/9;
var leadingH = 540;

game = new Phaser.Game(leadingH*ratio, leadingH, Phaser.AUTO, '');

game.state.add('Start', gameStates.Start);
game.state.add('Level', gameStates.Level);
game.state.add('End', gameStates.End);

game.state.start('Start');