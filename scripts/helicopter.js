(function (window) {
    function Helicopter () {
        this.initialize();
    }
    var helicopterSpriteData = {
        images: ['./images/paratroopers.png']
        , frames: [
            [0,0,118,42]
            ,[118,0,118,42]
            ,[236,0,118,42]
            ,[354,0,118,42]
            ,[472,0,118,42]
            ,[591,0,118,42]
            ,[709,0,118,42]
            ,[827,0,118,42]
            ,[945,0,118,42]
            ,[1063,0,118,42]
            ,[0,43,118,42]
            ,[118,43,118,42]
            ,[236,43,118,42]
            ,[354,43,118,42]
            ,[472,43,118,42]
            ,[591,43,118,42]
            ,[709,43,118,42]
            ,[827,43,118,42]
            ,[945,43,118,42]
            ,[1063,43,118,42]
        ]
        , animations: {
            right: [0, 9, 'right', 1]
            ,left: [10, 19, 'left', 1]
        }
    };
    var h = Helicopter.prototype = new createjs.BitmapAnimation();
            Helicopter.prototype.helicopterSpriteSheet = new createjs.SpriteSheet(helicopterSpriteData);
    h.width = 0;
    h.height = 0;
    h.x = 0;
    h.y = 0;

    h.BitmapAnimation_initialize = h.initialize;
    h.initialize = function () {
        this.BitmapAnimation_initialize(this.helicopterSpriteSheet);
        this.height = 42;
        this.width = 118;
        this.y = Math.random()*100+20;
        this.x = -150;
        this.dX = Math.random()*2+2;
        this.extractionPoint_1 = Math.random()*300;
        this.extractionPoint_1_max = this.extractionPoint_1 + this.dX;
        this.extractionPoint_2 = Math.random()*300+600;
        this.extractionPoint_2_max = this.extractionPoint_2 + this.dX;
        var rnd = Math.round(Math.random());
        if (rnd == 0) {
            this.x = stageWidth;
            this.dX = -this.dX;
            this.gotoAndPlay('right');
        } else if (rnd == 1) {
            this.gotoAndPlay('left');
        }
    };

    h.update = function () {
        this.x += this.dX;
    };

    window.Helicopter = Helicopter;
})(window);