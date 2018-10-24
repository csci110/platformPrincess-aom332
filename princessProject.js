import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("cemetery.png");

class Wall extends Sprite {
    constructor(x, y) {
        super();
        this.name = "Wall";
        this.setImage("wall.png", 500, 0);
        this.accelerateOnBounce = false;

    }
}
new Wall(0, 175);

class Support extends Sprite {
    constructor(x, y, image) {
        super(x, y, image);
        this.x = x;
        this.y = y;
        this.setImage(image);
    }
}
class Platform extends Support {
    constructor(x, y, image) {
        super(x, y, image);
        this.name = "A platform";
        this.accelerateOnBounce = false;
    }
}
let startPlatform = new Platform(0, 400, "start.png");
let finishPlatform = new Platform(game.displayWidth - 48 * 2, 400, "finish.png");

class Slider extends Support {
    constructor(x, y, angle) {
        super(x, y, "slider.png");
        this.name = "A sliding support";
        this.angle = angle;
        this.speed = 48;
        this.accelerateOnBounce = true;
    }
}
new Slider(startPlatform.x + 48 * 3, startPlatform.y + 48, 0);
new Slider(finishPlatform.x - 48 * 5, finishPlatform.y + 48, 180);

class Princess extends Sprite {
    constructor(x, y, image) {
        super();
        this.setImage("ann.png");
        this.speed = 0;
        this.speedWhenWalking = 125;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.isFalling = false;
        this.x = 48;
        this.y = 300;


        this.spellCastTime = 0;
    }
    handleLeftArrowKey() {
        this.angle = 180;
        this.speed = this.speedWhenWalking;
    }
    handleRightArrowKey() {
        this.angle = 0;
        this.speed = this.speedWhenWalking;
    }
    handleGameLoop() {
        if (this.angle === 0 && this.speed >= 0) {
            this.playAnimation("right", true);
        }

        if (this.angle === 180 && this.speed >= 0) {
            this.playAnimation("left", true);
        }
        this.x = Math.max(5, this.x);

        this.isFalling = false; // assume she is not falling unless proven otherwise
        // Check directly below princess for supports
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 3, Support);
        // Is there none, or is its *top* above the bottom of the princess?
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true; // she is falling so ...
            this.y = this.y + 4; // simulate gravity
        }

    }
    handleSpacebar() {
        if (!this.isFalling) {
            this.y = this.y - 3.0 * this.height; // jump
        }
    }

    handleBoundaryContact() {
        game.end('Princess Ann has drowned.\n\nBetter luck next time.');
        this.true;
    }
}
let ann = new Princess(40, 300, "ann.png");

class Door extends Sprite {
    constructor(x, y) {
        super();
        this.name = "The exite door";
        this.setImage("door.png");
        this.accelerateOnBounce = false;
        this.x = x;
        this.y = y;

    }
    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            game.end('Congratulations!\n\nPrincess Ann can now pursue' +
                'the\nstranger deeper into the castle!')
        }
    }
}
let exit = new Door(game.displayWidth - 48, finishPlatform.y - 2 * 48);

class Spider extends Sprite {
    constructor(x, y) {
        super();
        this.name = "Enemy Spider";
        this.setImage("spider.png");
        this.x = x;
        this.y = y;
        this.speed = 48;
        this.accelerateOnBounce = false;
        this.defineAnimation("creep", 0, 2);
        this.playAnimation("creep", true);
    }
    handleGameLoop() {
        if (this.y < ann.y - 48) {
            this.angle = 270;
        }
        if (this.y > ann.y)
            this.angle = 90;
    }
}
new Spider(200, 225);
new Spider(550, 200);

class Bat extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.name = "A scary bat";
        this.setImage("bat.png");
        this.accelerateOnBounce = false;
        this.defineAnimation("flap", 0, 1);
        this.playAnimation("flap", true);
        this.speed = this.normalSpeed = 20;
        this.angle = 280;
        this.attackSpeed = 300;
        this.angle = 45 + Math.round(Math.random() * 3) * 90;
        this.angleTimer = 0;
        this.x = this.startX = x;
        this.y = this.startY = y;


    }
    attack() {
        this.speed = this.attackSpeed;
        this.aimFor(ann.x, ann.y);
    }

    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            otherSprite.y = otherSprite.y + 1; // knock Ann off platform
        }
        return false;
    }

    handleGameLoop() {
        if (Math.random() < 0.001) {
            this.attack();
        }
        // if bat is not attacking: hover.
        if (this.speed === this.normalSpeed) {


            // start a 5-second timer
            let now = game.getTime(); // now is current time
            if (now - this.angleTimer > 3) { // if 3 seconds have elapsed since reset
                this.angleTimer = 0; // reset timer
                // Add code here that you want to repeat every 3 seconds

                if (Math.random() < 0.5) {
                    this.angle = this.angle + 90;
                }
                if (Math.random() > 0.5) {
                    this.angle = this.angle + 180;
                }
            }
        }
    }
    handleBoundaryContact() {
        if (this.y <= 0) {
            this.y = 0;
        }
        if (this.y > game.displayHeight) {
            this.y = this.startY;
            this.speed = this.normalSpeed;
            this.angle = this.angle = 225;
        }
    }
}
let leftBat = new Bat(200, 100);
let rightBat = new Bat(500, 75);