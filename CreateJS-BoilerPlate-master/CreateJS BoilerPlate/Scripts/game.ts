var stage: createjs.Stage;
var queue;

var tank: Tank
var tnt: TNT
var nazi: Nazi 

function preload(): void {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "grass", src: "images/Grass.png" },
        { id: "tank", src: "images/Tank.png" },
        { id: "tnt", src: "images/TNT.png" },
        { id: "nazi1", src: "images/Nazi1.png" },
        { id: "death", src: "sounds/death.mp3" }
    ]);
}

function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    main();
}

function gameLoop(event): void {
    tank.update();
    stage.update();
    nazi.update();
    tnt.update();
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
    dx: number;
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
        this.image.y += this.dx;
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



function main(): void
{
    nazi = new Nazi();
    tnt = new TNT();
    tank = new Tank();
}