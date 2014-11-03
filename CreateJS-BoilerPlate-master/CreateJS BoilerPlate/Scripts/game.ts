var stage: createjs.Stage;
var queue;

var grass: Grass
var tank: Tank
var tnt = [];
var nazis = [];

var NAZI_NUM = 4;
var TNT_NUM = 2;

function preload(): void {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "grass", src: "images/Grass.png" },
        { id: "tank", src: "images/Tank.png" },
        { id: "tnt", src: "images/TNT.png" },
        { id: "nazi1", src: "images/Nazi1.png" },
        { id: "boom", src: "sounds/boom.wav" },
        { id: "death", src: "sounds/death.mp3" }
    ]);
}

function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    //stage.cursor = "none"; If you want to hide Mouse
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    main();
}

function gameLoop(event): void {
    grass.update();
    tank.update();
    for (var t = 0; t < TNT_NUM; t++) {
        tnt[t].update();
    }
    for (var n = 0; n < NAZI_NUM; n++) {
        nazis[n].update();
    }

    collision();
    stage.update();
}

class Tank
{
    image: createjs.Bitmap;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("tank"));
        this.image.regY = this.image.getBounds().height / 2;
        this.image.y = 200;
        this.image.x = 700;
        stage.addChild(this.image);

    }

    update() {
        this.image.y = stage.mouseY;

    }
}

class Nazi
{
    image: createjs.Bitmap;
    dy: number;
    //dx: number;
    constructor(){
        this.image = new createjs.Bitmap(queue.getResult("nazi1"));
        this.image.regX = this.image.getBounds().width / 2;
        this.image.regY = this.image.getBounds().height / 2;
        this.reset();
        stage.addChild(this.image);
    }

    reset() {
        this.dy = Math.floor(Math.random() * 5 + 5); //Random speed of TNT
        //this.dx = Math.floor(Math.random() * 2 - 1); //Makes the tilt of the enemy solider
        this.image.x = 0;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
    }

    update(){
        this.image.x += this.dy;
        //this.image.x += this.dy;
        if (this.image.x >= (stage.canvas.width + this.image.getBounds().width)) {
            this.reset();
        }
    }
}

class TNT {
    image: createjs.Bitmap;
    dy: number;

    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("tnt"));
        this.image.regX = this.image.getBounds().width / 2;
        this.image.regY = this.image.getBounds().height / 2;
        this.reset();
        this.dy = 4;
        stage.addChild(this.image);
    }

    reset() {
        this.image.x = 0;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
    }

    update() {
        this.image.x += this.dy;
        if (this.image.x >= (stage.canvas.width + this.image.getBounds().width)) {
            this.reset();
        }
    }
}

class Grass {
    image: createjs.Bitmap;
    dy: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("grass"));
        this.reset();
        this.dy = 4; //Keep same as TNT to make look like its on ground
        stage.addChild(this.image);
    }

    reset() {
        this.image.x = -this.image.getBounds().width + stage.canvas.width;
    }

    update() {
        this.image.x += this.dy;
        if (this.image.x >= 0) {
            this.reset();
        }
    }
}

function tankAndTNT()
{
    for (var a = 0; a < TNT_NUM; a++) {
        var p1: createjs.Point;
        var p2: createjs.Point;

        p1 = new createjs.Point();
        p2 = new createjs.Point();

        p1.x = tank.image.x;
        p1.y = tank.image.y;
        p2.x = tnt[a].image.x;
        p2.y = tnt[a].image.y;

        if (distance(p1, p2) < ((tank.image.getBounds().height / 2) + (tnt[a].image.getBounds().height / 2))) {
            createjs.Sound.play("boom");
            tnt[a].reset();
            stage.update();

        }
    }

}

function tankAndNazi() {
    for (var a = 0; a < NAZI_NUM; a++) {
        var p1: createjs.Point;
        var p2: createjs.Point;

        p1 = new createjs.Point();
        p2 = new createjs.Point();

        p1.x = tank.image.x;
        p1.y = tank.image.y;
        p2.x = nazis[a].image.x;
        p2.y = nazis[a].image.y;

        if (distance(p1, p2) < ((tank.image.getBounds().height / 2) + (nazis[a].image.getBounds().height / 2))) {
            createjs.Sound.play("death");
            nazis[a].reset();
            stage.update();

        }
    }

}

function collision() {
    tankAndTNT();
    tankAndNazi();



}


//Distance between two points
function distance(p1: createjs.Point, p2: createjs.Point): number {
    var result: number = 0;
    var xPoints: number = 0;
    var yPoints: number = 0;

    xPoints = p2.x - p1.x;
    xPoints = xPoints * xPoints;

    yPoints = p2.y - p1.y;
    yPoints = yPoints * yPoints;

    result = Math.sqrt(xPoints + yPoints);

    return result;

}

function main(): void
{
    grass = new Grass();
    for (var i = 0; i < NAZI_NUM; i++) {
        nazis[i] = new Nazi();
    }
    for (var o = 0; o < TNT_NUM; o++) {
        tnt[o] = new TNT();
    }
    tank = new Tank();

}