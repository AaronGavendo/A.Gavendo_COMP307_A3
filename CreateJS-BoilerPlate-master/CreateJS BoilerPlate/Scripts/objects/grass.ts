module objects {
    export class Grass {
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

}