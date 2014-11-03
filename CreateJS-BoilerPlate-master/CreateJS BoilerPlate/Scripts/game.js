var stage;
var queue;

var grass;
var tank;
var tnt = [];
var nazis = [];
var scoreboard;

var LIVES_NUM = 3;
var NAZI_NUM = 4;
var TNT_NUM = 2;

var GAME_FONT = "34px Consolas";
var FONT_COLOUR = "#FF0000";

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "grass", src: "images/Grass.png" },
        { id: "tank", src: "images/Tank.png" },
        { id: "tnt", src: "images/TNT.png" },
        { id: "nazi1", src: "images/Nazi1.png" },
        { id: "boom", src: "sounds/boom.wav" },
        { id: "engine", src: "sounds/engine.wav" },
        { id: "death", src: "sounds/death.mp3" }
    ]);
}

function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);

    //stage.cursor = "none"; If you want to hide Mouse
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    main();
}

function gameLoop(event) {
    grass.update();
    tank.update();
    for (var t = 0; t < TNT_NUM; t++) {
        tnt[t].update();
    }
    for (var n = 0; n < NAZI_NUM; n++) {
        nazis[n].update();
    }

    collision();
    scoreboard.update();
    stage.update();
}

var Tank = (function () {
    function Tank() {
        this.image = new createjs.Bitmap(queue.getResult("tank"));
        this.image.regY = this.image.getBounds().height * 0.5;
        this.image.y = 200;
        this.image.x = 700;
        stage.addChild(this.image);
        createjs.Sound.play("engine", 0, 0, 0, -1, 1, 1);
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
        this.image.regX = this.image.getBounds().width * 0.5;
        this.image.regY = this.image.getBounds().height * 0.5;
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
        this.image.regX = this.image.getBounds().width * 0.5;
        this.image.regY = this.image.getBounds().height * 0.5;
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

var Grass = (function () {
    function Grass() {
        this.image = new createjs.Bitmap(queue.getResult("grass"));
        this.reset();
        this.dy = 4; //Keep same as TNT to make look like its on ground
        stage.addChild(this.image);
    }
    Grass.prototype.reset = function () {
        this.image.x = -this.image.getBounds().width + stage.canvas.width;
    };

    Grass.prototype.update = function () {
        this.image.x += this.dy;
        if (this.image.x >= 0) {
            this.reset();
        }
    };
    return Grass;
})();

function tankAndTNT() {
    for (var a = 0; a < TNT_NUM; a++) {
        var p1;
        var p2;

        p1 = new createjs.Point();
        p2 = new createjs.Point();

        p1.x = tank.image.x;
        p1.y = tank.image.y;
        p2.x = tnt[a].image.x;
        p2.y = tnt[a].image.y;

        if (distance(p1, p2) < ((tank.image.getBounds().height * 0.5) + (tnt[a].image.getBounds().height * 0.5))) {
            createjs.Sound.play("boom");
            scoreboard.lives -= 1;
            tnt[a].reset();
            stage.update();
        }
    }
}

function tankAndNazi() {
    for (var a = 0; a < NAZI_NUM; a++) {
        var p1;
        var p2;

        p1 = new createjs.Point();
        p2 = new createjs.Point();

        p1.x = tank.image.x;
        p1.y = tank.image.y;
        p2.x = nazis[a].image.x;
        p2.y = nazis[a].image.y;

        if (distance(p1, p2) < ((tank.image.getBounds().height * 0.5) + (nazis[a].image.getBounds().height * 0.5))) {
            createjs.Sound.play("death");
            scoreboard.score += 1;
            nazis[a].reset();
            stage.update();
        }
    }
}

function collision() {
    tankAndTNT();
    tankAndNazi();
}

//Distance between two points //From Teacher Example
function distance(p1, p2) {
    var result = 0;
    var xPoints = 0;
    var yPoints = 0;

    xPoints = p2.x - p1.x;
    xPoints = xPoints * xPoints;

    yPoints = p2.y - p1.y;
    yPoints = yPoints * yPoints;

    result = Math.sqrt(xPoints + yPoints);

    return result;
}

var Scoreboard = (function () {
    function Scoreboard() {
        this.lives = LIVES_NUM;
        this.score = 0;
        this.labelString = "";
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.update();
        stage.addChild(this.label);
    }
    Scoreboard.prototype.update = function () {
        this.labelString = "Lives: " + this.lives.toString() + " Kills: " + this.score.toString();
        this.label.text = this.labelString;
    };
    return Scoreboard;
})();

function main() {
    grass = new Grass();
    for (var i = 0; i < NAZI_NUM; i++) {
        nazis[i] = new Nazi();
    }
    for (var o = 0; o < TNT_NUM; o++) {
        tnt[o] = new TNT();
    }
    tank = new Tank();
    scoreboard = new Scoreboard();
}
//# sourceMappingURL=game.js.map
