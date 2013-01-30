var preload, canvas, stage, stageWidth, stageHeight, cannon, base, turret;
var count = 0;
var bullets = [];
var enemies = [];
var particles =[];
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var points = 0;
var ttd = 10;
var gameOver = true;
var multiplier = 130;
var rotateRight, rotateLeft, fire;
var manifest = [
      {id: 'sprites', src: './images/paratroopers.png'}
    , {id: 'bgd', src: './images/background.jpg'}
    , {id: 'explosionImg', src: './images/boom.png'}
    , {id: 'baseImg', src: './images/base.png'}
    , {id: 'turretImg', src: './images/turret.png'}
    , {id: 'cannonImg', src: './images/cannon.png'}
    , {id: 'menuBgd', src: './images/menu_bgd.jpg'}
    , {id: 'bulletImg', src: './images/bullet.png'}
    , {id: 'bgdMusic', src: './sounds/mixdown.mp3|./sounds/mixdown.wav'}
    , {id: 'explosion', src: './sounds/explosion.ogg|./sounds/explosion.mp3|./sounds/explosion.wav'}
    , {id: 'shot', src: './sounds/shot.ogg|./sounds/shot.mp3|./sounds/shot.wav'}
    , {id: 'scream', src: './sounds/scream.ogg|./sounds/scream.mp3|./sounds/scream.wav'}
    , {id: 'scream2', src: './sounds/scream2.ogg|./sounds/scream2.mp3|./sounds/scream2.wav'}
    , {id: 'scream3', src: './sounds/scream3.ogg|./sounds/scream3.mp3|./sounds/scream3.wav'}
    , {id: 'helicopter', src: './sounds/helicopter.ogg|./sounds/helicopter.mp3|./sounds/helicopter.wav'}
    , {id: 'bomb_whistle', src: './sounds/bomb.ogg|./sounds/bomb.mp3|./sounds/bomb.wav'}
    , {id: 'bomber_fly', src: './sounds/bomber_fly.ogg|./sounds/bomber_fly.mp3|./sounds/bomber_fly.wav'}
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
    canvas = document.getElementById('stage');
    stage = new createjs.Stage(canvas);
    stageWidth = canvas.width;
    stageHeight = canvas.height;
    initGameMenu();
}

function initGameMenu () {
    createjs.SoundJS.play('bgdMusic', createjs.SoundJS.INTERRUPT_NONE, 0, 0, -1);
    $('.stage_wrap').css('background' , 'url("./images/menu_bgd.jpg")');
    $('.buttons').show();
    var logoText = new createjs.Text('ParatrooperS', '100px Orbitron', '#caebd0');
    logoText.x = 120;
    logoText.y = 30;
    logoText.outline = true;
    logoText.shadow = new createjs.Shadow('#567b4d', 4, 4, 5);
    stage.addChild(logoText);
    stage.update();
    $('.start_button').on('click', function () {
        $('.buttons').hide();
        stage.removeChild(logoText);
        stage.update();
        createjs.SoundJS.stop('bgdMusic');
        gameStart();
    });

}

function gameStart () {
    ttd = 10;
    count = 0;
    gameOver = false;
    points = 0;
    bullets = [];
    enemies = [];
    particles = [];
    $('.stage_wrap').css('background' , 'url("./images/background.jpg")');
    $('.score').show();
    var ground = new createjs.Shape();
    ground.graphics.beginFill('#b0a6a5').drawRect(0, 580, 1000, 20);
    if (!base) {
        base = new createjs.Bitmap(preload.getResult('baseImg').result);
        base.x = 450;
        base.y = 513;
    }
    if(!turret) {
        turret = new createjs.Bitmap(preload.getResult('turretImg').result);
        turret.x = 462;
        turret.y = 454;
        turret.width = 77;
        turret.height = 72;
    }
    if (!cannon) {
        cannon = new createjs.Bitmap(preload.getResult('cannonImg').result);
        cannon.regX = 12;
        cannon.regY = 119;
        cannon.x = 501;
        cannon.y = 465;
        cannon.rotation = 0;
    }
    stage.addChild(ground, base, cannon, turret);
    stage.update();
    createjs.useRAF = true;
    createjs.Ticker.setFPS(50);
    createjs.Ticker.addListener(window);
}

function tick () {
    bulletsUpdate();
    updateParticles();
    if (ttd <= 0) {
        gameOver = true;
        if (ttd == 0) {
            count = 0;
            ttd = -1;
            for (var m = 0; m < 5; m++) {
                var lastExplosion = new Explosion(Math.random()*70+420, Math.random()*50+450);
                stage.addChild(lastExplosion);
            }
            createjs.SoundJS.play('explosion', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
            stage.removeChild(turret);
            stage.removeChild(cannon);
            var gameOverText = new createjs.Text('Game Over', '100px Orbitron', '#f2230e');
            gameOverText.x = 180;
            gameOverText.y = 150;
            gameOverText.outline = false;
            gameOverText.shadow = new createjs.Shadow('#567b4d', 4, 4, 5);
            stage.addChild(gameOverText);
        }
        if (count == 500) {
            stage.removeAllChildren();
            base = null;
            turret = null;
            cannon = null;
            createjs.Ticker.removeListener(window);
            $('.score').hide();
            initGameMenu ();
        }
    }
    if (count == 10001) {
        count = 0;
    }
    if (gameOver == false) {
        cannonAction();
        if (count > 200 && count % 1000 == 0 && multiplier > 50) {
            multiplier -= 10;
        }
        if (count > 200 && count % multiplier == 0) {
            var helicopter = new Helicopter();
            stage.addChild(helicopter);
            enemies.push(helicopter);
            createjs.SoundJS.play('helicopter', createjs.SoundJS.INTERRUPT_EARLY, 0, 0, 0);
        }
        if (count > 1000 && count % 600 == 0) {
            var bomber = new Bomber();
            stage.addChild(bomber);
            enemies.push(bomber);
            createjs.SoundJS.play('bomber_fly', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
        }
    }
    if (enemies.length > 0) {
        var collide = ndgmr.checkPixelCollision;
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
                    var explosion = new Explosion(Math.random()*70+420, Math.random()*50+450);
                    createjs.SoundJS.play('explosion', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
                    stage.addChild(explosion);
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
                    createjs.SoundJS.play('bomb_whistle', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
                }
            }
            if (e instanceof Bomb) {
                if (collide(e, turret, 1)) {
                    if (e.x > 500) {
                        var exp = new Explosion(e.x-20, e.y-10);
                    } else if (e.x < 500) {
                        exp = new Explosion(e.x-30, e.y-20);
                    }
                    ttd -= 1;
                    stage.addChild(exp);
                    stage.removeChild(e);
                    enemies.splice(i, 1);
                    createjs.SoundJS.play('explosion', createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0);
                }
            }
            if (bullets.length > 0) {
                for (var j = 0; j < bullets.length; j++) {
                    var b = bullets[j];
                    if (collide(b, e, 1)) {
                        if (e instanceof Helicopter || e instanceof Bomber || e instanceof Bomb) {
                            explosion = new Explosion(e.x + 20, e.y - 10);
                            if (e instanceof Helicopter) {
                                points += 100;
                            } else if (e instanceof Bomber) {
                                points += 500;
                                createjs.SoundJS.stop('bomber_fly');
                            } else if (e instanceof Bomb) {
                                points += 1000;
                                createjs.SoundJS.stop('bomb_whistle');
                                explosion = new Explosion(e.x - 20, e.y - 10);
                            }
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
    if (rotateRight && angle < 70){angle += 2.0; cannon.rotation = angle;}
    if (rotateLeft && angle > -70){angle -= 2.0; cannon.rotation = angle;}
    if (fire && count % 6 == 0) {
        var bX = cannon.x + Math.cos(cannon.rotation * Math.PI / 180 - Math.PI / 2) * 119;
        var bY = cannon.y + Math.sin(cannon.rotation * Math.PI / 180 - Math.PI / 2) * 119;
        var bDx = Math.cos(cannon.rotation * Math.PI/180 - Math.PI/2) * 7;
        var bDy = Math.sin(cannon.rotation * Math.PI/180 - Math.PI/2) * 7;
        var bullet = new createjs.Bitmap(preload.getResult('bulletImg').result);
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
}

function bulletsUpdate () {
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