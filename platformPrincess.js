import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("water.png");

class Wall extends Sprite {
    constructor() {
        super();
        this.name = "Wall";
        this.setImage("wall.png");
        this.x = 0;
        this.y = 175;
        this.accelerateOnBounce = false;
        
    }
}
