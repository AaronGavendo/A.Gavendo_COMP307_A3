var stage;
var queue;

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "loading", src: "images/loading.jpg" },
        { id: "yay", src: "sounds/yay.ogg" }
    ]);
}

function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", handleTick);
    gameStart();
}

function handleTick(event) {
    stage.update();
}

function gameStart() {
    // Add code here
    // Some example code here - to be replaced
    var placeholder = new createjs.Bitmap(queue.getResult('loading'));
    placeholder.regX = placeholder.image.width / 2;
    placeholder.regY = placeholder.image.height / 2;
    placeholder.x = stage.canvas.width / 2;
    placeholder.y = stage.canvas.height / 2;
    stage.addChild(placeholder);
    createjs.Sound.play("yay");
}
//# sourceMappingURL=game.js.map
