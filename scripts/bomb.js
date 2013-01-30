(function (window) {
    function Bomb (x, y) {
        this.initialize(x, y);
    }
    var bombSpriteData = {
        images: ['./images/paratroopers.png']
        , frames: [
            [1181, 135, 82, 18]
        ]
        , animations : {
            drop: [0]
        }
    };
    var b = Bomb.prototype = new createjs.BitmapAnimation();
    Bomb.prototype.bombSpriteSheet = new createjs.SpriteSheet(bombSpriteData);
    b.width = 0;
    b.height = 0;
    b.x = 0;
    b.y = 0;

    b.BitmapAnimation_initialize = b.initialize;
    b.initialize = function (x, y) {
        this.BitmapAnimation_initialize(this.bombSpriteSheet);
        this.height = 18;
        this.width = 50;
        this.regX = 3;
        this.regY = 3;
        this.scaleX = this.scaleY = .8;
        this.y = y;
        this.x = x;
        this.dX = 3;
        this.dY = 3.5;
        if (this.x < 500) {
            this.rotation = -170;
        } else if (this.x > 500) {
            this.rotation = -40
        }
        this.gotoAndPlay('drop');
    };
    b.update = function () {
        this.x += this.dX;
        this.y += this.dY;
    };

    window.Bomb = Bomb;
})(window);