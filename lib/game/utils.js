SCORE = 0;
LIVES = 5;

var prevScore = 0;
function updateScore(){
    if (SCORE != prevScore){
        scoreBar.text = SCORE;
        prevScore = SCORE;
    }
}

var prevLives = 0;
function updateLives(){
    if (LIVES != prevLives){
        livesBar.text = LIVES;
        prevLives = LIVES;
    }
}

/* MUSIC */
function initMusic(){
    bulletFire = game.add.audio('bulletFire', 0.03, false);
    bulletHitWall = game.add.audio('bulletHitWall', 0.03, false);
    iceCrash = game.add.audio('iceCrash', 0.2, false);
    //winterydoomroom = game.add.audio('winterydoomroom', 0.15, true);
    zvoncek1 = game.add.audio('zvoncek1', 0.2, false);
    zvoncek2 = game.add.audio('zvoncek2', 0.2, false);
    zvoncek3 = game.add.audio('zvoncek3', 0.2, false);
    zvoncek4 = game.add.audio('zvoncek4', 0.2, false);
    zvonckiSounds = [zvoncek1, zvoncek2, zvoncek3, zvoncek4];
}