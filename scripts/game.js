const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var textField = document.querySelector("h1");

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var balls = [];

var imgKolobok = new Image();
imgKolobok.src = 'images/kolobok.png';
var eatedCount = 0;

// opts-start

var kolobokStartSize = width * 0.1;
var animCycle = 400;
var kolobokStartAmount = 1;
var ballSpawnAmount = 1;
var ballSpawnType = 'click';
var kolobokSpeed = 2;
var ballSpeed = 10;

// opts-end

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function drawBall(e) {
    var cursorX = e.pageX;
    var cursorY = e.pageY;

    do {
        var velX = random(-ballSpeed, ballSpeed);
        var velY = random(-ballSpeed, ballSpeed);
    } while (velY === velX === 0);

    for (var i = 0; i <= ballSpawnAmount; i++){
        balls.push(new Ball(cursorX, cursorY, velX, velY, randomRGB(), random(10, 20)));
    }
    
}

class Ball {

    constructor(x, y, velX, velY, color, size){
        if (x + size >= width){
            this.x = x - size;
        } else if (x - size <= 0) {
            this.x = x + size;
        } else {
            this.x = x;
        }

        if (y + size >= height) {
            this.y = y - size;
        } else if (y - size <= 0) {
            this.y = y + size;
        } else {
            this.y = y;
        }

        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.exist = 1;
        this.cooldown = 0;
        this.animCycle = 0;
        this.updateCycle = 0;
    }

    draw() {
        if (this.exist === 1){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    update() {
        
        if (this.x + this.size >= width){
            this.velX = -(this.velX);
            this.x -= this.size;
        }
        if (this.x - this.size <= 0){
            this.velX = -(this.velX);
            this.x += this.size;
        }
        if (this.y + this.size >= height){
            this.velY = -(this.velY);
            this.y -= this.size;
        }
        if (this.y - this.size <= 0){
            this.velY = -(this.velY);
            this.y += this.size;
        }

        this.x += this.velX;
        this.y += this.velY;

    }

    collisionDetect() {
        for (var ball of balls){
            if (!(this === ball)){
                    if (!(Kolobok.prototype.isPrototypeOf(ball))){
                        var distance = Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)); // гуглить расстояние между двумя точками
                        if (distance < (this.size + ball.size)){
                            this.velX = -(this.velX);
                            this.velY = -(this.velY);
                            do {
                                ball.velX = random(-ballSpeed, ballSpeed);
                                ball.velY = random(-ballSpeed, ballSpeed);
                            } while (ball.velY === ball.velX === 0);
                        }
                    }  
            }
        }
    }
}

class Kolobok extends Ball {

    draw(){
        ctx.drawImage(this.color, this.x, this.y, this.size, this.size);
        this.birth();
        if (this.updateCycle >= 20 && this.animCycle === 0) {
            this.color = imgKolobok;
            this.updateCycle = 0;
        }
    }

    update() {
        if (this.x + this.size >= width){
            this.velX = -(this.velX);
            this.x -= this.size / 30;
        }
        if (this.x <= 0){
            this.velX = -(this.velX);
            this.x += this.size / 30;
        }
        if (this.y + this.size >= height){
            this.velY = -(this.velY);
            this.y -= this.size / 30;
        }
        if (this.y <= 0){
            this.velY = -(this.velY);
            this.y += this.size / 30;
        }

        this.x += this.velX;
        this.y += this.velY;
        this.updateCycle++;
    }

    collisionDetect() {
        for (var ball of balls){
            if (!(Kolobok.prototype.isPrototypeOf(ball))){
                if (!(ball.velX === ball.velY === 0)){
                    var distance = Math.sqrt(Math.pow((this.x + (this.size / 2)) - ball.x, 2) + Math.pow((this.y + (this.size / 2)) - ball.y, 2)); // гуглить расстояние между двумя точками
                    if (distance < ((this.size / 3) + ball.size)){
                        let imgKolobokEats = new Image();
                        imgKolobokEats.src = 'images/kolobok-eats.png';
                        this.color = imgKolobokEats;
    
                        ball.exist = 0;
                        eatedCount++;
                        this.updateCycle++;
                        textField.textContent = "Ехидный колобок слопал: " + eatedCount;
                        this.size++;
    
                        if (this.cooldown === 5){
                            this.velX = random(-kolobokSpeed, kolobokSpeed);
                            this.velY = random(-kolobokSpeed, kolobokSpeed);
                            this.cooldown = 0;
                        }
                        
                        balls.splice(balls.indexOf(ball), 1);
                        this.cooldown++;
                    }
                }   
            }
        }
    }

    birth() {
        if ((this.size >= (width * 0.3)) || (this.size >= (height * 0.3))){
            for (var ball of balls){
                ball.velX = ball.velY = 0;
                if (this === ball){
                    if (this.animCycle === 0){
                        canvas.removeEventListener(ballSpawnType, drawBall);
                        let imgKolobokBad = new Image();
                        imgKolobokBad.src = 'images/kolobok-bad.png';
                        this.color = imgKolobokBad;
                    }
                    if (this.animCycle < animCycle){
                        this.velX = random(-1, 1);
                        this.velY = random(-1, 1);
                        this.animCycle++;
                    }
                    if (this.animCycle >= animCycle){
                        this.color = imgKolobok;
                        this.size = kolobokStartSize;
                    }
                }
            }
            if (this.animCycle >= animCycle){
                for (var ball of balls){
                    var speed;

                    if (!(Kolobok.prototype.isPrototypeOf(ball))){
                        speed = ballSpeed;
                    } else speed = kolobokSpeed;

                    ball.velX = random(-speed, speed);
                    ball.velY = random(-speed, speed);
                    this.animCycle = 0;
                }
                balls.unshift(new Kolobok(this.x + this.size, this.y, random(-kolobokSpeed, kolobokSpeed), random(-kolobokSpeed, kolobokSpeed), imgKolobok, kolobokStartSize));
                canvas.addEventListener(ballSpawnType, drawBall);
            }
        } else return;
    }
}

imgKolobok.onload = function() {
    for (var i = 0; i <= kolobokStartAmount; i++){
        balls.push(new Kolobok(width / 2, height / 2, random(-kolobokSpeed, kolobokSpeed), random(-kolobokSpeed, kolobokSpeed), imgKolobok, kolobokStartSize));
    }

    function loop() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0,  width, height);

        for (var ball of balls){
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }

        requestAnimationFrame(loop);
    }
    canvas.addEventListener(ballSpawnType, drawBall);
    loop();
}