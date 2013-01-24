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
        this.height = 14;
        this.width = 50;
        this.regX = 10;
        this.regY = 3;
        this.scaleX = this.scaleY = .7;
        this.y = y;
        this.x = x;
        this.dX = 2.5;
        this.dY = 3.5;
        if (this.x < 500) {
            this.rotation = -160;
        } else if (this.x > 500) {
            this.rotation = -20
        }
        this.gotoAndPlay('drop');
    };
    b.update = function () {
        this.x += this.dX;
        this.y += this.dY;
    };

    window.Bomb = Bomb;
})(window);