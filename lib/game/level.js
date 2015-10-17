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

    groundLayer.setScale(2, 2);
    backgroundMovinglayer.setScale(2, 2);
    backgroundLayer.setScale(2, 2);
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
    var buttonTextStyle = { font: "18px fixedsys", fill: "#232323", align: "center" };
    buttonDies = game.add.text(45, 33, text, buttonTextStyle);

    var text = "PAUSE";
    buttonPause = game.add.text(198, 33, text, buttonTextStyle);

	var text = "Level happening";
	var style = { font: "65px fixedsys", fill: "#ff0044", align: "center" };

	t = game.add.text(game.world.centerX-300, 100, text, style);

	var scoreStyle = { font: "64px fixedsys", fill: "#000", align: "right" };
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
        tileBody.collides(volkodlakCollisionGroup);
        tileBody.nameType = 'tile';
    }

    //polygons.setCollisionGroup(polygonCollisionGroup);
}