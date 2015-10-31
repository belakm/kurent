/*

    Objects:
    - enemy Volkodlak
    - flower
    - snow

*/

function setupObjects(object){
    if (object.parent.label == 'flower'){ // FLOWERS
        object.loadTexture('flower1', 0);
        object.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        object.scale.setTo(2,2);
        object.x = 2*object.x;
        object.y = 2*object.y;

        object.nameType = 'flower';

        object.physicsBodyType = Phaser.Physics.P2JS;
        game.physics.p2.enable(object);

        object.body.data.shapes[0].sensor = true;

        object.animations.add('bloom');

        object.body.static = true;

        object.body.x = object.body.x + 32;
        object.body.y = object.body.y + 116;

        object.body.setCollisionGroup(flowerCollisionGroup);
        //object.body.collides(tilesCollisionGroup);
        object.body.collides(playerCollisionGroup);
        object.body.onBeginContact.add(collisionFlower, this);

    } else if (object.parent.label == 'icicle'){ // ICICLES

        object.loadTexture('icicle', 0);
        object.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        object.scale.setTo(2,2);
        object.x = 2*object.x + 32;
        object.y = 2*object.y + 94;

        object.nameType = 'icicle';

        object.physicsBodyType = Phaser.Physics.P2JS;
        game.physics.p2.enable(object);
        object.body.fixedRotation = true;
        object.body.mass = 2;
        //object.body.data.shapes[0].sensor = true;
        object.body.static = true;

        object.body.setCollisionGroup(icicleCollisionGroup);
        object.body.collides(tilesCollisionGroup, icicleHitGround);
        object.body.collides(playerCollisionGroup);
        object.body.collides(icicleCollisionGroup);
        object.body.collides(bulletCollisionGroup);
        object.body.collides(volkodlakCollisionGroup);

        object.body.onBeginContact.add(icicleHitPlayer, this);

    } else if (object.parent.label == 'volkodlak'){ // ENEMY - VOLKODLAK
        object.loadTexture('volkodlak', 0);
        object.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        object.scale.setTo(2,2);
        object.x = 2*object.x;
        object.y = 2*object.y;

        object.nameType = 'volkodlak';

        object.animations.add('walk', [0,1,2,3], 7, false);

        object.physicsBodyType = Phaser.Physics.P2JS;
        game.physics.p2.enable(object);
        object.body.fixedRotation = true;
        object.body.mass = 2;

        object.moving = false;
        object.baited = false;

        var bloodEmitter = game.add.emitter(0, 0, 200);
        bloodEmitter.makeParticles('blooxPX');
        bloodEmitter.gravity = 200;    
        bloodEmitter.maxParticleScale = 2;
        bloodEmitter.minParticleScale = 1;

        bloodEmitter.minRotation = 0;
        bloodEmitter.maxRotation = 0;

        bloodEmitter.setAll('texture.baseTexture.scaleMode', PIXI.scaleModes.NEAREST);

        object.addChild(bloodEmitter);    

        //object.body.data.shapes[0].sensor = true;

        //object.animations.add('bloom');

        //object.body.static = true;

        //object.body.x = object.body.x + 32;
        //object.body.y = object.body.y + 116;

        object.body.setCollisionGroup(volkodlakCollisionGroup);
        object.body.collides(tilesCollisionGroup);
        object.body.collides(playerCollisionGroup, enemyHitPlayer);
        object.body.collides(bulletCollisionGroup);
        object.body.collides(icicleCollisionGroup);
        object.body.onBeginContact.add(collisionVolkodlak, this);
    } else {
        console.log('setupObjects: unknown type')
    }
}
function updateObjects(){
    enemiesVolkodlak.forEach(updateVolkodlak, this);
    icicles.forEach(updateIcicles, this);
}



/* ICICLES */
function initIcicles(){
    icicles = game.add.group();
    icicles.label = 'icicle';
    map.createFromObjects('Game objects', 64, 'gameObjects', 0, true, false, icicles);
    icicles.forEach(setupObjects, this);
}

function tweenDeath(enemy){
    var tween = game.add.tween(enemy);
    tween.to({ alpha: 0 }, 100, Phaser.Easing.Linear.None);
    tween.onComplete.add(function () {
        enemy.kill();
    });
    tween.start();
}

function icicleHitGround(icicle){
    tweenDeath(icicle.sprite);
}

function enemyHitPlayer(enemy){
    LIVES--;
}

function icicleHitPlayer(a, b, c, d){
    if (a.sprite != null && a.sprite.nameType == 'player'){
        LIVES--;
        var icicle = c.body.parent.sprite;
        icicle.body.clearCollision(playerCollisionGroup);
        tweenDeath(icicle);
    }
}

/* ENEMY - VOLKODLAK */
function initVolkodlak(){
    enemiesVolkodlak = game.add.group();
    enemiesVolkodlak.label = 'volkodlak';
    map.createFromObjects('Game objects', 62, 'gameObjects', 0, true, false, enemiesVolkodlak);
    enemiesVolkodlak.forEach(setupObjects, this);
}

function initVolkodlakSensors(){
}

function updateVolkodlak(volkodlak2){
    if (volkodlak2.dead && !volkodlak2.deadDone){
        volkodlak2.body.setZeroForce();
        volkodlak2.body.setZeroVelocity();
        volkodlak2.body.moveUp(500);
        volkodlak2.deadDone = true;
    } else if (volkodlak2.dead) return;
    var volkodlak = volkodlak2;
    volkodlak.facing = (volkodlak.x < player.x) ? true : false; // DESNO : LEVO
    if (volkodlak.baited || (Math.abs(volkodlak.x - player.x) < 300 && (Math.abs(volkodlak.y - player.y) < 200))){
        volkodlak.moving = true;
        volkodlak.baited = true;
        if (volkodlak.facing){ // DESNO
            volkodlak.scale.x = 2;
            volkodlak.body.moveRight(130);
        } else { // LEVO
            volkodlak.scale.x = -2;
            volkodlak.body.moveLeft(130);
        }
        volkodlak.animations.play('walk');
    } else if (!volkodlak.baited) {
        volkodlak.frame = 1;
        volkodlak.moving = false;
        volkodlak.body.velocity = 0;
    }
}

function updateIcicles(icicle){
    if (Math.abs(icicle.x - player.x) < 10){
        icicle.body.static = false;
    }
}

function collisionVolkodlak(a, b, c, d){
    var volkodlak = c.body.parent.sprite;
    if (a.sprite != null && a.sprite.key == 'bullet'){

        a.sprite.kill();
        //enemiesVolkodlak.removeChild(volkodlak);
        //volkodlak.kill();
        volkodlak.dead = true;
        volkodlak.body.clearCollision(playerCollisionGroup);
        volkodlak.body.clearCollision(bulletCollisionGroup);

        volkodlak.loadTexture('skull', 0);
        volkodlak.animations.add('skullsomething');
        volkodlak.animations.play('skullsomething', 60, true);
        volkodlak.body.setRectangle(21,21);

        volkodlak.physicsBodyType = Phaser.Physics.P2JS;
        game.physics.p2.enable(volkodlak);
        volkodlak.body.fixedRotation = true;
        volkodlak.body.mass = 5;
        volkodlak.body.velocity = 0;
        //volkodlak.body.setRectangle(21,21);

        volkodlak.body.onBeginContact.add(collisionVolkodlakSkull, this);

        volkodlak.body.setCollisionGroup(volkodlakCollisionGroup);
        volkodlak.body.collides(tilesCollisionGroup);

        // BLOOD STREAM
        var bloodEmitter = volkodlak.children[0];
        //bloodEmitter.x = volkodlak.body.x;
        //bloodEmitter.y = volkodlak.body.y;
        bloodEmitter.setXSpeed(-30, 30);
        bloodEmitter.setYSpeed(-100, 0);

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is particles interval
        //  The final parameter (10) is how many particles will be emitted in this single burst
        bloodEmitter.start(false, 2000, 1, 50);
    }
}
function collisionVolkodlakSkull(a, b, c, d){
     var volkodlakSkull = c.body.parent.sprite;
     volkodlakSkull.animations.stop();
     volkodlakSkull.frame = 0;
}
/* FLOWER */

function initFlowers(){
    flowers = game.add.group();
    flowers.label = 'flower';
    map.createFromObjects('Game objects', 63, 'gameObjects', 0, true, false, flowers);
    flowers.forEach(setupObjects, this);
}

function collisionFlower(a, b, c, d){
    var flower = c.body.parent.sprite;
    flower.body.clearCollision(playerCollisionGroup);
    flower.animations.play('bloom', 12, false);
    //player.body.thrust(10);
    zvonckiSounds[Math.floor(Math.random()*zvonckiSounds.length)].play();;
    SCORE++;
}

/* END FLOWER */

/* SNOW */ 

var max = 0;
var front_emitter;
var mid_emitter;
var back_emitter;
var update_interval = 4 * 60;
var i = 0;

function initSnow(){
    back_emitter = game.add.emitter(game.world.centerX, -32, 600);
    back_emitter.makeParticles('snowflake');
    back_emitter.maxParticleScale = 3;
    back_emitter.minParticleScale = 3;
    back_emitter.setYSpeed(20, 100);
    back_emitter.gravity = 0;
    back_emitter.width = game.world.width * 1.5;
    back_emitter.minRotation = 0;
    back_emitter.maxRotation = 0;

    mid_emitter = game.add.emitter(game.world.centerX, -32, 250);
    mid_emitter.makeParticles('snowflake');
    mid_emitter.maxParticleScale = 6;
    mid_emitter.minParticleScale = 6;
    mid_emitter.setYSpeed(50, 150);
    mid_emitter.gravity = 0;
    mid_emitter.width = game.world.width * 1.5;
    mid_emitter.minRotation = 0;
    mid_emitter.maxRotation = 0;

    front_emitter = game.add.emitter(game.world.centerX, -32, 50);
    front_emitter.makeParticles('snowflake');
    front_emitter.maxParticleScale = 9;
    front_emitter.minParticleScale = 9;
    front_emitter.setYSpeed(100, 200);
    front_emitter.gravity = 0;
    front_emitter.width = game.world.width * 1.5;
    front_emitter.minRotation = 0;
    front_emitter.maxRotation = 0;

    back_emitter.fixedToCamera = true;
    mid_emitter.fixedToCamera = true;
    front_emitter.fixedToCamera = true;

    changeWindDirection();

    back_emitter.start(false, 14000, 20);
    mid_emitter.start(false, 12000, 40);
    front_emitter.start(false, 6000, 1000);
}
function changeWindDirection() {

    var multi = Math.floor((max + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    max = max + frag;

    if (max > 200) max = 150;
    if (max < -200) max = -150;

    setXSpeed(back_emitter, max);
    setXSpeed(mid_emitter, max);
    setXSpeed(front_emitter, max);

}

function setXSpeed(emitter, max) {

    emitter.setXSpeed(max - 20, max);
    emitter.forEachAlive(setParticleXSpeed, this, max);

}

function setParticleXSpeed(particle, max) {

    particle.body.velocity.x = max - Math.floor(Math.random() * 30);

}

/* END SNOW */ 