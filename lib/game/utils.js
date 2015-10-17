SCORE = 0;

var prevScore = 0;
function updateScore(){
    if (SCORE != prevScore){
        scoreBar.text = SCORE;
        prevScore = SCORE;
    }
}

/* MUSIC */
function initMusic(){
    bulletFire = game.add.audio('bulletFire', 0.03, false);
    bulletHitWall = game.add.audio('bulletHitWall', 0.03, false);
    iceCrash = game.add.audio('iceCrash', 0.2, false);
    winterydoomroom = game.add.audio('winterydoomroom', 0.15, true);
}