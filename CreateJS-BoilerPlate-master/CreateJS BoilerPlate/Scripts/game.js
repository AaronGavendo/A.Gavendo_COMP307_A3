var stage;
var queue;

var tank;
var tnt = [];
var nazis = [];

var NAZI_NUM = 4;
var TNT_NUM = 2;

function preload() {
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

function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    main();
}

function gameLoop(event) {
    tank.update();
    for (var t = 0; t < TNT_NUM; t++) {
        tnt[t].update();
    }
    for (var n = 0; n < NAZI_NUM; n++) {
        nazis[n].update();
    }
    stage.update();
}

var Tank = (function () {
    function Tank() {
        this.image = new createjs.Bitmap(queue.getResult("tank"));
        this.image.regY = this.image.getBounds().height / 2;
        this.image.y = 200;
        this.image.x = 700;
        stage.addChild(this.image);
    }
    Tank.prototype.update = function () {
        this.image.y = stage.mouseY;
    };
    return Tank;
})();

var Nazi = (function () {
    //dx: number;
    function Nazi() {
        this.image = new createjs.Bitmap(queue.getResult("nazi1"));
        this.image.regX = this.image.getBounds().width / 2;
        this.image.regY = this.image.getBounds().height / 2;
        this.reset();
        stage.addChild(this.image);
    }
    Nazi.prototype.reset = function () {
        this.dy = Math.floor(Math.random() * 5 + 5); //Random speed of TNT

        //this.dx = Math.floor(Math.random() * 2 - 1); //Makes the tilt of the enemy solider
        this.image.x = 0;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
    };

    Nazi.prototype.update = function () {
        this.image.x += this.dy;

        //this.image.x += this.dy;
        if (this.image.x >= (stage.canvas.width + this.image.getBounds().width)) {
            this.reset();
        }
    };
    return Nazi;
})();

var TNT = (function () {
    function TNT() {
        this.image = new createjs.Bitmap(queue.getResult("tnt"));
        this.image.regX = this.image.getBounds().width / 2;
        this.image.regY = this.image.getBounds().height / 2;
        this.reset();
        this.dy = 4;
        stage.addChild(this.image);
    }
    TNT.prototype.reset = function () {
        this.image.x = 0;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
    };

    TNT.prototype.update = function () {
        this.image.x += this.dy;
        if (this.image.x >= (stage.canvas.width + this.image.getBounds().width)) {
            this.reset();
        }
    };
    return TNT;
})();

function main() {
    for (var i = 0; i < NAZI_NUM; i++) {
        nazis[i] = new Nazi();
    }
    for (var o = 0; o < TNT_NUM; o++) {
        tnt[o] = new TNT();
    }
    tank = new Tank();
}
//# sourceMappingURL=game.js.map
