function initControls(){
	cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    if (!game.device.desktop){
        buttonLeft.onInputDown.add(buttonDownLeft, this);
        buttonRight.onInputDown.add(buttonDownRight, this);
        buttonJump.onInputDown.add(buttonDownJump, this);
        buttonShoot.onInputDown.add(buttonDownShoot, this);

        buttonLeft.onInputUp.add(buttonUpLeft, this);
        buttonRight.onInputUp.add(buttonUpRight, this);
        buttonJump.onInputUp.add(buttonUpJump, this);
        buttonShoot.onInputUp.add(buttonUpShoot, this);
    }
}

// MOBILE BUTTONS
var mobileInputs = {
    jump: false,
    left: false,
    right: false,
    shoot: false
}
function buttonDownLeft(){
    mobileInputs.left = true;
}
function buttonDownRight(){
    mobileInputs.right = true;
}
function buttonDownJump(){
    mobileInputs.jump = true;
}
function buttonDownShoot(){
    mobileInputs.shoot = true;
}

function buttonUpLeft(){
    mobileInputs.left = false;
}
function buttonUpRight(){
    mobileInputs.right = false;
}
function buttonUpJump(){
    mobileInputs.jump = false;
}
function buttonUpShoot(){
    mobileInputs.shoot = false;
}

// GAMEPAD

var gamePadButtons = {
    A : false,
    B : false,
    X : false,
    Y : false,
    down: false,
    up: false,
    left: false,
    right: false
}

function onDown(button, value) {
    console.log(button);
    if (button.buttonCode === Phaser.Gamepad.XBOX360_A)
    {
        gamePadButtons.A = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_B)
    {
        gamePadButtons.B = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
    {
        gamePadButtons.X = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_Y)
    {
        gamePadButtons.Y = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT)
    {
        gamePadButtons.left = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT)
    {
        gamePadButtons.right = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_UP)
    {
        gamePadButtons.up = true;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_DOWN)
    {
        gamePadButtons.down = true;
    }
}
function onUp(button, value) {
    if (button.buttonCode === Phaser.Gamepad.XBOX360_A)
    {
        gamePadButtons.A = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_B)
    {
        gamePadButtons.B = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
    {
        gamePadButtons.X = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_Y)
    {
        gamePadButtons.Y = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT)
    {
        gamePadButtons.left = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT)
    {
        gamePadButtons.right = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_UP)
    {
        gamePadButtons.up = false;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_DOWN)
    {
        gamePadButtons.down = false;
    }
}

function addButtons(){
    //  We can't do this until we know that the gamepad has been connected and is started

    console.log('gamepad connected');

    buttonA = pad.getButton(Phaser.Gamepad.XBOX360_A);
    buttonB = pad.getButton(Phaser.Gamepad.XBOX360_B);
    buttonX = pad.getButton(Phaser.Gamepad.XBOX360_X);
    buttonY = pad.getButton(Phaser.Gamepad.XBOX360_Y);

    buttonA.onDown.add(onDown, this);
    buttonB.onDown.add(onDown, this);
    buttonX.onDown.add(onDown, this);
    buttonY.onDown.add(onDown, this);

    buttonA.onUp.add(onUp, this);
    buttonB.onUp.add(onUp, this);
    buttonX.onUp.add(onUp, this);
    buttonY.onUp.add(onUp, this);

    //  These won't work in Firefox, sorry! It uses totally different button mappings

    buttonDPadLeft = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
    buttonDPadRight = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
    buttonDPadUp = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
    buttonDPadDown = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);

    buttonDPadLeft.onDown.add(onDown, this);
    buttonDPadRight.onDown.add(onDown, this);
    buttonDPadUp.onDown.add(onDown, this);
    buttonDPadDown.onDown.add(onDown, this);

    buttonDPadLeft.onUp.add(onUp, this);
    buttonDPadRight.onUp.add(onUp, this);
    buttonDPadUp.onUp.add(onUp, this);
    buttonDPadDown.onUp.add(onUp, this);
}

