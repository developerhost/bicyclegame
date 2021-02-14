var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width = 400;
c.height = 400;
var size = 30;

document.body.appendChild(c);

// //山の斜面を作成
var perm = [];



while (perm.length < 255) {
  while(perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
}

var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2; //ベクトル

var noise = x => {
  x = x * 0.01 % 255; //0.1=ギザギザを拡大
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x)); //線形分離で山の斜面を作成
}

var player = new function() {
  this.x = c.width / 2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0; //回転
  this.rSpeed = 0; //回転スピード

  this.img = new Image();
  this.img.src = "images/suga.png";

  this.draw = function() {
    var p1 = c.height - noise(t + this.x) * 0.25;
    var p2 = c.height - noise(t + 5 + this.x) * 0.25;

    

    var grounded = 0;

    if(p1 - size > this.y) {
      this.ySpeed += 0.1; 
    } else {
      this.ySpeed -= this.y - (p1 - size);
      this.y = p1 - size; //山の座標と同じになるように

      grounded = 1;
    }

    //角度反転で地面に接着してればゲームオーバー
    if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
      playing = false;
      this.rSpeed = 5;
      k.ArrowUp = 1;
      this.x -= speed * 5;
    }

    //x,y座標を元に角度を設定
    var angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x);

    // this.rot = angle;

    this.y += this.ySpeed;

    //地面に触れたら角度が変わるように
    if(grounded && playing) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }

    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.5;
    this.rot -= this.rSpeed * 0.1;


    //回転しすぎないように
    if(this.rot > Math.PI) this.rot = -Math.PI;
    if(this.rot < -Math.PI) this.rot = Math.PI;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -size, -size, 80, 80); //プレイヤーの画像を書き出し

    ctx.restore();
  }
}

var t = 0; //徐々に斜面が動く
var speed = 0;
var playing = true;
var k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0}; //矢印キーで動くように 

function loop() {
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.1;
  t += 10 * speed;
  ctx.fillStyle = "#19f";
  ctx.fillRect(0, 0, c.width, c.height); //画面を作成

  ctx.fillStyle = "black";

  ctx.beginPath();
  ctx.moveTo(0, c.height);

  //斜面の描画
  for (var i = 0; i < c.width; i++) {
    ctx.lineTo(i, c.height - noise(t + i) * 0.25); //始点と終点を定義して線を引く
  }

  ctx.lineTo(c.height, c.height);

  ctx.fill();

  player.draw();
  requestAnimationFrame(loop);
}

onkeydown = d => k[d.key] = 1; //キーを押してる
onkeyup = d => k[d.key] = 0; //キーを押してない

function up() {

}

function down(){

}

function left(){

}

function right(){
  
}

loop();