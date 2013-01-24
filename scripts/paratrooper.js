(function (window) {
    function Paratrooper (x, y) {
        this.initialize(x, y);
    }

    var paratrooperSpriteData = {
        images: ['./images/paratroopers.png']
        , frames: [
             [659, 118, 35, 50] //left 0-7
            ,[616, 118, 35, 50]
            ,[572, 118, 35, 50]
            ,[528, 118, 35, 50]
            ,[485, 118, 35, 50]
            ,[441, 118, 35, 50]
            ,[398, 118, 35, 50]
            ,[354, 118, 35, 50]
            ,[0, 118, 35, 50]   //right 8-15
            ,[43, 118, 35, 50]
            ,[87, 118, 35, 50]
            ,[131, 118, 35, 50]
            ,[175, 118, 35, 50]
            ,[218, 118, 35, 50]
            ,[262, 118, 35, 50]
            ,[305, 118, 35, 50]
            ,[52, 237, 57, 44]  //hideLeft 16-32
            ,[121, 237, 57, 44]
            ,[191, 237, 57, 44]
            ,[260, 237, 57, 44]
            ,[330, 237, 57, 44]
            ,[399, 237, 57, 44]
            ,[469, 237, 57, 44]
            ,[538, 237, 57, 44]
            ,[608, 237, 57, 44]
            ,[678, 237, 57, 44]
            ,[747, 237, 57, 44]
            ,[817, 237, 57, 44]
            ,[886, 237, 57, 44]
            ,[956, 237, 57, 44]
            ,[1025, 237, 57, 44]
            ,[1095, 237, 57, 44]
            ,[1165, 237, 57, 44]
            ,[1112, 192, 57, 44] //hideRight 33-49
            ,[1043, 192, 57, 44]
            ,[973, 192, 57, 44]
            ,[904, 192, 57, 44]
            ,[834, 192, 57, 44]
            ,[765, 192, 57, 44]
            ,[695, 192, 57, 44]
            ,[626, 192, 57, 44]
            ,[556, 192, 57, 44]
            ,[486, 192, 57, 44]
            ,[417, 192, 57, 44]
            ,[347, 192, 57, 44]
            ,[278, 192, 57, 44]
            ,[208, 192, 57, 44]
            ,[139, 192, 57, 44]
            ,[69, 192, 57, 44]
            ,[0, 192, 57, 44]
            ,[0, 326, 26, 26]     //runLeft 50-61
            ,[26, 326, 26, 26]
            ,[52, 326, 26, 26]
            ,[78, 326, 26, 26]
            ,[104, 326, 26, 26]
            ,[130, 326, 26, 26]
            ,[156, 326, 26, 26]
            ,[182, 326, 26, 26]
            ,[208, 326, 26, 26]
            ,[234, 326, 26, 26]
            ,[260, 326, 26, 26]
            ,[286, 326, 26, 26]
            ,[611, 326, 26, 26]  //runRight 62-73
            ,[585, 326, 26, 26]
            ,[559, 326, 26, 26]
            ,[533, 326, 26, 26]
            ,[507, 326, 26, 26]
            ,[481, 326, 26, 26]
            ,[455, 326, 26, 26]
            ,[429, 326, 26, 26]
            ,[403, 326, 26, 26]
            ,[377, 326, 26, 26]
            ,[351, 326, 26, 26]
            ,[325, 326, 26, 26]
        ]
        , animations: {
             left: [0, 7, 'left', 4]
            ,right: [8, 15, 'right', 4]
            ,hideLeft: [16, 32, 'runRight', 4]
            ,hideRight: [33, 49, 'runLeft', 4]
            ,runLeft: [50, 61, 'runLeft', 4]
            ,runRight: [62, 73, 'runRight', 4]
        }
    };

    var p = Paratrooper.prototype = new createjs.BitmapAnimation();
            Paratrooper.prototype.paratrooperSpriteSheet = new createjs.SpriteSheet(paratrooperSpriteData);
    p.width = 0;
    p.height = 0;
    p.x = 0;
    p.y = 0;
    p.dX = 0;
    p.dY = 0;

    p.bitmapAnimation_initialize = p.initialize;
    p.initialize = function (x, y) {
        this.bitmapAnimation_initialize(this.paratrooperSpriteSheet);
        this.width = 35;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.dX = 0;
        this.dY = .8;
        if (this.x < 500) {
            this.gotoAndPlay('left');
        } else if (this.x > 500) {
            this.gotoAndPlay('right');
        }
    };

    p.update = function () {
        this.x += this.dX;
        this.y += this.dY;
        if (this.y >= 540) {
            this.y = 540;
            this.dY = 0;
            if (this.currentAnimation == 'left') {
                if (this.currentAnimation != 'runRight' && this.currentAnimation != 'hideLeft') {
                    this.regX = 30;
                    this.gotoAndPlay('hideLeft');
                    this.onAnimationEnd = function () {
                        this.regX = 0;
                        this.regY = -16;
                        this.dX = .8;
                    }
                }
            } else if (this.currentAnimation == 'right') {
                if (this.currentAnimation != 'runLeft' && this.currentAnimation != 'hideRight') {
                    this.regX = -3;
                    this.gotoAndPlay('hideRight');
                    this.onAnimationEnd = function () {
                        this.regX = 0;
                        this.regY = -16;
                        this.dX = -.8;
                    }
                }
            }
        }
    };
    window.Paratrooper = Paratrooper;
})(window) ;