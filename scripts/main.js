var preload, canvas, stage, stageWidth, stageHeight, cannon, base, turret;
var count = 0;
var bullets = [];
var enemies = [];
var particles =[];
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var points = 0;
var ttd = 0;
var multiplier = 100;
var rotateRight, rotateLeft, fire;
var manifest = [
      {id: 'sprites', src: './images/paratroopers.png'}
    , {id: 'bgd', src: './images/background.jpg'}
    , {id: 'explosionImg', src: './images/boom.png'}
    , {id: 'baseImg', src: './images/base.png'}
    , {id: 'turretImg', src: './images/turret.png'}
    , {id: 'cannonImg', src: './images/cannon.png'}
    , {id: 'menuBgd', src: './images/menu_bgd.jpg'}
    , {id: 'bgdMusic', src: './sounds/mixdown.mp3|./sounds/mixdown.wav'}
    , {id: 'explosion', src: './sounds/explosion.ogg|./sounds/explosion.mp3|./sounds/explosion.wav'}
    , {id: 'shot', src: './sounds/shot.ogg|./sounds/shot.mp3|./sounds/shot.wav'}
    , {id: 'scream', src: './sounds/scream.ogg|./sounds/scream.mp3|./sounds/scream.wav'}
    , {id: 'scream2', src: './sounds/scream2.ogg|./sounds/scream2.mp3|./sounds/scream2.wav'}
    , {id: 'scream3', src: './sounds/scream3.ogg|./sounds/scream3.mp3|./sounds/scream3.wav'}
    , {id: 'helicopter', src: './sounds/helicopter.ogg|./sounds/helicopter.mp3|./sounds/helicopter.wav'}
];
var angle = 0;
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function  init () {
    $('.loading').show();
    preload = new createjs.PreloadJS();
    preload.onComplete = doneLoading;
    preload.installPlugin(createjs.SoundJS);
    preload.loadManifest(manifest);
}

function doneLoading () {
    $('.loading').fadeOut();
    //createjs.SoundJS.play('bgdMusic', createjs.SoundJS.INTERRUPT_NONE, 0, 0, -1);
    canvas = document.getElementById('stage');
    stage = new createjs.Stage(canvas);
    stageWidth = canvas.width;
    stageHeight = canvas.height;
    initGameMenu();
}

function initGameMenu () {
    $('.stage_wrap').css('background' , 'url("./images/menu_bgd.jpg")');
    var logoText = new createjs.Text('ParatrooperS', '100px Orbitron', '#caebd0');
    logoText.x = 120;
    logoText.y = 30;
    logoText.outline = true;
    logoText.shadow = new createjs.Shadow('#567b4d', 4, 4, 5);
    stage.addChild(logoText);
    stage.update();
    $('.start_button').on('click', function () {
        $(this).hide();
        stage.removeChild(logoText);
        stage.update();
        gameStart();
    });
}

function gameStart () {
    $('.stage_wrap').css('background' , 'url("./images/background.jpg")');
    $('.score').show();
    var ground = new createjs.Shape();
    ground.graphics.beginFill('#b0a6a5').drawRect(0, 580, 1000, 20);
    base = new createjs.Bitmap(preload.getResult('baseImg').result);
    base.x = 450;
    base.y = 513;
    turret = new createjs.Bitmap(preload.getResult('turretImg').result);
    turret.x = 462;
    turret.y = 454;
    cannon = new createjs.Bitmap(preload.getResult('cannonImg').result);
    cannon.regX = 12;
    cannon.regY = 119;
    cannon.x = 501;
    cannon.y = 465;
    cannon.rotation = 0;
    stage.addChild(ground, base, cannon, turret);
    stage.update();
    createjs.useRAF = true;
    createjs.Ticker.setFPS(50);
    createjs.Ticker.addListener(window);
}

function collide (object1, object2) {
    return object1.x <= (object2.x + object2.width - 6) &&
           object1.y <= (object2.y + object2.height - 6) &&
           object2.x+3 <= (object1.x + object1.width) &&
           object2.y+3 <= (object1.y + object1.height);
}

function tick () {
    updateParticles();
    cannonAction();
    if (count == 10000) {
        count = 0;
    }
    if (count > 200 && count % 1000 == 0 && multiplier > 50) {
        multiplier -= 10;
    }
    if (count > 200 && count % multiplier == 0) {
        var helicopter = new Helicopter();
        stage.addChild(helicopter);
        enemies.push(helicopter);
        createjs.SoundJS.play('helicopter', createjs.SoundJS.INTERRUPT_EARLY, 0, 0, 0);
    }
    if (count == 9000 || count == 9500 || count == 10000) {
        var bomber = new Bomber();
        stage.addChild(bomber);
        enemies.push(bomber);
    }

    if (enemies.length > 0) {
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (e instanceof Helicopter) {
                if (e.currentAnimation == 'left' && e.x > stageWidth
                    || e.currentAnimation == 'right' && e.x < - e.width) {
                    stage.removeChild(e);
                    enemies.splice(i, 1);
                } else if (e.x > e.extractionPoint_1 && e.x < e.extractionPoint_1_max ||
                    e.x > e.extractionPoint_2 && e.x < e.extractionPoint_2_max) {
                    var paratrooper = new Paratrooper(e.x + 50, e.y +30);
                    stage.addChild(paratrooper);
                    enemies.push(paratrooper);
                }
            }
            if (e instanceof Paratrooper) {
                if(e.currentAnimation == 'runRight' && e.x >= 445 || e.currentAnimation == 'runLeft' && e.x <= 530) {
                    stage.removeChild(e);
                    enemies.splice(i, 1);
                    ttd -= 1;
                }
            }
            if (e instanceof Bomber) {
                if (e.x > e.extractionPoint && e.x < e.extractionPoint_max) {
                    var bomb = new Bomb(e.x + e.width/2, e.y + e.height);
                    if (e.currentAnimation == 'left') {
                        bomb.dX = -bomb.dX;
                    }
                    stage.addChild(bomb);
                    enemies.push(bomb);
                }
            }
            if (bullets.length > 0) {
                for (var j = 0; j < bullets.length; j++) {
                    var b = bullets[j];
                    if (collide(b, e)) {
                        if (e instanceof Helicopter || e instanceof Bomber || e instanceof Bomb) {
                            if (e instanceof Helicopter) {
                                points += 100;
                            } else if (e instanceof Bomber) {
                                points += 500;
                            } else if (e instanceof Bomb) {
                                points += 1000;
                            }
                            var explosion = new Explosion(e.x + 20, e.y - 10);
                            stage.addChild(explosion);
                            createjs.SoundJS.play('explosion', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
                        } else if (e instanceof Paratrooper) {
                            setParticles(e.x + e.width/2, e.y + e.height/2, 1, 1, 30, '#f2230e');
                            var rndSnd = Math.floor(Math.random()*3);
                            if (rndSnd == 0) {
                                createjs.SoundJS.play('scream', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
                            } else if (rndSnd == 1) {
                                createjs.SoundJS.play('scream2', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
                            } else if (rndSnd == 2) {
                                createjs.SoundJS.play('scream3', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
                            }
                            points += 50;
                        }
                        stage.removeChild(e, b);
                        enemies.splice(i, 1);
                        bullets.splice(j, 1);
                    }
                }
            }
            e.update();
        }
    }
    $('.score span').text(points);
    stage.update();
    count ++;
    $('#one').html(enemies.length + ' ' + bullets.length + '<br/>' + ttd + '<br/>' + 'count: ' + count);
}

function cannonAction (){
    if (rotateRight && angle < 70){angle += 2.5; cannon.rotation = angle;}
    if (rotateLeft && angle > -70){angle -= 2.5; cannon.rotation = angle;}
    if (fire && count % 10 == 0) {
        var bX = cannon.x + Math.cos(cannon.rotation * Math.PI / 180 - Math.PI / 2) * 119;
        var bY = cannon.y + Math.sin(cannon.rotation * Math.PI / 180 - Math.PI / 2) * 119;
        var bDx = Math.cos(cannon.rotation * Math.PI/180 - Math.PI/2) * 7;
        var bDy = Math.sin(cannon.rotation * Math.PI/180 - Math.PI/2) * 7;
        var bullet = new createjs.Shape();
        bullet.graphics.beginFill('#000000').drawRect(0, 0, 3, 3);
        bullet.x = bX;
        bullet.y = bY;
        bullet.width = 3;
        bullet.height = 3;
        bullet.dX = bDx;
        bullet.dY = bDy;
        bullets.push(bullet);
        stage.addChild(bullet);
        createjs.SoundJS.play('shot', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
    }
    if (bullets.length > 0) {
        for (var j = 0; j < bullets.length; j ++) {
            var  b = bullets[j];
            b.x += b.dX;
            b.y += b.dY;
            if (b.x > stageWidth || b.x < -b.width || b.y < -b.height) {
                bullets.splice(j, 1);
                stage.removeChild(b);
            }
        }
    }
}

function handleKeyDown(e) {
    if(!e) {e = window.event;}
    switch(e.keyCode) {
        case KEY_SPACE:	fire = true; return false;
        case KEY_LEFT:	rotateLeft = true; return false;
        case KEY_RIGHT: rotateRight = true; return false;
    }
}

function handleKeyUp(e) {
    if(!e) {e = window.event;}
    switch(e.keyCode) {
        case KEY_SPACE:	fire = false; break;
        case KEY_LEFT:	rotateLeft = false; break;
        case KEY_RIGHT: rotateRight = false; break;
    }
}

function setParticles (x, y, width, height, life, color) {
    for (var i = 0; i < 80; i++) {
        var p = new createjs.Shape();
        p.graphics.beginFill(color).drawRect(0, 0, width, height);
        p.x = x;
        p.y = y;
        p.dX = Math.random()*4-2;
        p.dY = Math.random()*4-2;
        p.life = life;
        p.rotation = 0;
        p.dR = Math.random()*8-4;
        stage.addChild(p);
        particles.push(p);
    }
}

function updateParticles () {
    if (particles.length > 0) {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.dX;
            p.y += p.dY;
            p.rotation += p.dR;
            p.life -= 1;
            if (p.life < 30) {
                p.alpha -= .03;
            }
            if (p.life == 0) {
                stage.removeChild(p);
                particles.splice(i, 1);
            }
        }
    }
}

//http://www.freesfx.co.uk