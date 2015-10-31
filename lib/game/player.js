/*

PLAYER
WEAPON - BULLETS

*/

// PLAYER

function initPlayer(){

    // PLAYER INIT
    playerGroup = game.add.group();
    map.createFromObjects('Game objects', 61, 'gameObjects', 0, true, false, playerGroup);
    player = playerGroup.children[0];
    player.loadTexture('player', 0);
    player.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    player.scale.setTo(2,2);
    player.x = 2*player.x;
    player.y = 2*player.y;

    game.physics.p2.enable(player);

    initPlayerSensors();

    player.animations.add('walk', [0,1,2,3], 12, false);
    player.animations.add('stay', [4,5,6,7], 6, true);
    player.animations.add('jump', [8,9,10,11], 12, true);

    player.frame = 0;
    
    player.body.fixedRotation = true;
    player.body.mass = 2;

    player.touching = false;
    player.body.onBeginContact.add(kurentTouching,this);
    player.body.onEndContact.add(kurentTouchingEnd, this);

	// BULLETS INIT
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.P2JS;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('body.data.gravityScale', 0);

    // PLAYER COLLISION
    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides(tilesCollisionGroup);
    player.body.collides(polygonCollisionGroup);
    player.body.collides(flowerCollisionGroup);
    player.body.collides(volkodlakCollisionGroup);

    for (var i = 0; i < bullets.children.length; i++) {
        var bulletBody = bullets.children[i].body;
        bulletBody.setCollisionGroup(bulletCollisionGroup);
        bulletBody.collides(tilesCollisionGroup, collisionBulletFloor);
        bulletBody.collides(volkodlakCollisionGroup, collisionBulletFloor);
        bulletBody.collides(polygonCollisionGroup, collisionBulletFloor);
    }
}

function playerMovement(){
    if (cursors.left.isDown || gamePadButtons.left)
    {
        player.body.moveLeft(200);
        player.scale.x = -2; //flipped
        
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
        player.scale.x = 2; //flipped
       

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

function initPlayerSensors(){
    aboveSensor = player.body.addRectangle(50, 10, 0, -53);
    belowSensor = player.body.addRectangle(50, 10, 0, 53);
    leftSensor = player.body.addRectangle(10, 96, -30, 0);
    rightSensor = player.body.addRectangle(10, 96, 30, 0);
    aboveSensor.sensor = true;
    belowSensor.sensor = true;
    leftSensor.sensor = true;
    rightSensor.sensor = true;
}

function playerCollision(){
}


function playerDeath(){
    if (!player.inWorld) {
        endGame();
    }
}

function kurentTouching (a, b, c, d){
    if (a.sprite != null && a.sprite.nameType == 'flower') return 0;
    if (c === belowSensor) {
        player.touching = true;
        console.log('floor');
    }
    else if (c === aboveSensor) console.log('ceiling');
    else if (c === leftSensor) console.log('left touch');
    else if (c === rightSensor) console.log('right touch');
}
function kurentTouchingEnd (a, b, c, d){
    if (a.sprite != null && a.sprite.nameType == 'flower') return 0;
    if (c === belowSensor) {
        player.touching = false;
        console.log('leaving floor');
    }
    else if (c === aboveSensor) console.log('ceiling');
    else if (c === leftSensor) console.log('left touch');
    else if (c === rightSensor) console.log('right touch');
}

function collisionFloor(){

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

// END PLAYER

// WEAPON - BULLETS

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

function collisionBulletFloor(bullet){ // DETECTS BULLETS HITTING THE FLOOR
    killBullet(bullet.sprite)
    bulletHitWall.play();
}