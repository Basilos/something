(function (window) {
    function Explosion (x, y) {
        this.initialize(x, y);
    }

    var explosionSpriteData = {
        images : ['./images/boom.png']
        , frames: [
             [0, 0, 81, 64]
            ,[85, 0, 81, 64]
            ,[166, 0, 81, 64]
            ,[247, 0, 81, 64]
            ,[328, 0, 81, 64]
            ,[409, 0, 81, 64]
            ,[490, 0, 81, 64]
            ,[571, 0, 81, 64]
            ,[652, 0, 81, 64]
            ,[720, 0, 81, 64]
        ]
        , animations: {
            boom : [0, 9, null, 4]
        }
    };

    var e = Explosion.prototype = new createjs.BitmapAnimation();
            Explosion.prototype.explosionSpriteSheet = new createjs.SpriteSheet(explosionSpriteData);
    e.x = 0;
    e.y = 0;
    e.width = 0;
    e.height = 0;

    e.BitmapAnimation_initialize = e.initialize;
    e.initialize = function (x, y) {
        this.BitmapAnimation_initialize(this.explosionSpriteSheet);
        this.x = x;
        this.y = y;
        this.width = 81;
        this.height = 64;
        this.gotoAndPlay('boom');
        this.onAnimationEnd = function () {
            stage.removeChild(this);
        };
    };

    window.Explosion = Explosion;
})(window);