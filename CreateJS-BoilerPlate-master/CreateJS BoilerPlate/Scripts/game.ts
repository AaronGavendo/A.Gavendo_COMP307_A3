var stage: createjs.Stage;
var queue;

var tank: Tank

function preload(): void {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "grass", src: "images/Grass.png" },
        { id: "tank", src: "images/Tank.png" },
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
}

class Tank
{
    image: createjs.Bitmap;
    constructor()
    {
        this.image = new createjs.Bitmap(queue.getResult("tank"));
        this.image.regY = this.image.getBounds().height / 2;
        this.image.y = 200;
        this.image.x = 700;
        stage.addChild(this.image);

    }

    update()
    {
        this.image.y = stage.mouseY;

    }
}


function main(): void
{
    tank = new Tank();

}