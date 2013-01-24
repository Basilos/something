(function (window) {
    function Bomber () {
        this.initialize();
    }
    var bomberSpriteData = {
        images: ['./images/paratroopers.png']
        , frames: [
            [762, 122, 168, 38]
            ,[956, 122, 168, 38]
        ]
        , animations : {
            right: [0]
            , left: [1]
        }
    };
    var b = Bomber.prototype = new createjs.BitmapAnimation();
            Bomber.prototype.bomberSpriteSheet = new createjs.SpriteSheet(bomberSpriteData);
    b.width = 0;
    b.height = 0;
    b.x = 0;
    b.y = 0;

    b.BitmapAnimation_initialize = b.initialize;
    b.initialize = function () {
        this.BitmapAnimation_initialize(this.bomberSpriteSheet);
        this.height = 38;
        this.width = 168;
        this.y = Math.random()*20+10;
        this.x = -170;
        this.dX = 5;
        this.extractionPoint = 50;
        var rnd = Math.round(Math.random());
        if (rnd == 0) {
            this.x = stageWidth;
            this.dX = -5;
            this.extractionPoint = 800;
            this.gotoAndPlay('left');
        } else if (rnd == 1) {
            this.gotoAndPlay('right');
        }
        this.extractionPoint_max = this.extractionPoint + 10;
    };
    b.update = function () {
        this.x += this.dX;
    };

    window.Bomber = Bomber;
})(window);