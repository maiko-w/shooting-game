
//Twitterへのリンクの共有
window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));

//-------------ここからゲームの記述

//グローバル関数
var screenCanvas, info;
var run = true;
var fps = 1000 / 30;
var mouse = new Point();
var ctx;
var fire = false;
var counter = 0;
var score = 0;
var message = '';
//自分
var mycolor = 'rgba(255, 255, 255, 1.0)';
var myshot_color = 'rgba(0, 255, 0, 0.75)';
var myshot_count = 10;
//星
var starcolor = 'rgba(255, 255, 0, 0.75)';
var star_count = 10;
var starshot_color = 'rgba(255, 255, 0, 0.75)';
var starshot_count = 100;

window.onload = function(){

    screenCanvas = document.getElementById('canvas');
    screenCanvas.width = 350;
    screenCanvas.height = 600;
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    screenCanvas.addEventListener('mousedown', mouseDown, true);
    window.addEventListener('keydown', keyDown, true);

    ctx = screenCanvas.getContext('2d');

    screenCanvas.addEventListener('mousemove', mouseMove, true);
    window.addEventListener('keydown', keyDown, true);
    
    info = document.getElementById('info');

    var chara = new Character();
    chara.init(10);

    var charaShot = new Array(myshot_count);
    for(i = 0; i < myshot_count; i++){
        charaShot[i] = new CharacterShot();
    }
    var enemy = new Array(star_count);
    for(i = 0; i < star_count; i++){
        enemy[i] = new Enemy();
    }
    var enemyShot = new Array(starshot_count);
    for(i = 0; i < starshot_count; i++){
        enemyShot[i] = new EnemyShot();
    }


    // ループ処理呼び出し
    (function(){
     // HTML更新
     info.innerHTML = mouse.x + ' : ' + mouse.y;
     ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
     // パスの設定開始

     chara.position.x = mouse.x;
     chara.position.y = mouse.y;

     var img = new Image();
     img.onload = function () {
     ctx.drawImage(img, mouse.x, mouse.y, 50, 40);
     }
     img.src = "hikouki.png";

     if(fire){
     for(i = 0; i < myshot_count; i++){
     // Myshotが発射されているかチェック
     if(!charaShot[i].alive){
     // Myshot動く    	        
     charaShot[i].set(chara.position, 6, 9);
     break;
     }
     }
     fire = false;
     }

     ctx.beginPath();

     for(i = 0; i < myshot_count; i++){

         if(charaShot[i].alive){
             
             charaShot[i].move();

             // Myshotの記述
             ctx.arc(
                     charaShot[i].position.x,
                     charaShot[i].position.y,
                     charaShot[i].size,
                     Math.PI * 2, 0, false
                    );

             ctx.closePath();
         }
     }

     ctx.fillStyle = myshot_color;
     ctx.fill();

     //-----ここからは星の記述
     counter++;

     if(counter % 50  === 0){
         // すべての星調査
         for(i = 0; i < star_count; i++){
             // 星の生存チェック
             if(!enemy[i].alive){
                 // タイプを決定するパラメータを算出
                 j = (counter % 200) / 100;

                 // タイプに応じて初期位置を決める
                 var enemySize = 20;										
                 var p = new Point();
                 p.x = -enemySize + (screenCanvas.width + enemySize * 2) * j
                     p.y = screenCanvas.height / 3;

                 // 新しい星
                 enemy[i].set(p, enemySize, j);

                 // 1つ出現させてループを抜ける
                 break;
             }
         }
     }

     switch(true){
         // カウンターが70より小さい
         case counter < 70:
             ctx.fillStyle = "red";
             ctx.textAlign = "center";
             ctx.fillText("Ready?",250 ,250);
             ctx.font = "45px ''";

             break;

             // カウンターが100より小さい
         case counter < 100:
             ctx.fillStyle = "red";
             ctx.textAlign = "center";
             ctx.fillText("Go!",250 ,250);
             ctx.font = "45px ''";

             break;

             // カウンターが100以上
         default:

             ctx.beginPath();

             // すべての星を調査
             for(i = 0; i < star_count; i++){
                 // 星の生存チェック
                 if(enemy[i].alive){
                     //　星を動かす
                     enemy[i].move();
                     //星の記述
                     r = 20;
                     ctx.lineWidth = 3.0;
                     ctx.strokeStyle = 'black';
                     ctx.moveTo(enemy[i].position.x + Math.sin(0 * 2 * Math.PI / 5) * r, enemy[i].position.y - Math.cos(0 * 2 * Math.PI / 5) * r);
                     ctx.lineTo(enemy[i].position.x + Math.sin(2 * 2 * Math.PI / 5) * r, enemy[i].position.y - Math.cos(2 * 2 * Math.PI / 5) * r);
                     ctx.lineTo(enemy[i].position.x + Math.sin(4 * 2 * Math.PI / 5) * r, enemy[i].position.y - Math.cos(4 * 2 * Math.PI / 5) * r);
                     ctx.lineTo(enemy[i].position.x + Math.sin(1 * 2 * Math.PI / 5) * r, enemy[i].position.y - Math.cos(1 * 2 * Math.PI / 5) * r);
                     ctx.lineTo(enemy[i].position.x + Math.sin(3 * 2 * Math.PI / 5) * r, enemy[i].position.y - Math.cos(3 * 2 * Math.PI / 5) * r);
                     ctx.lineTo(enemy[i].position.x + Math.sin(0 * 2 * Math.PI / 5) * r, enemy[i].position.y - Math.cos(0 * 2 * Math.PI / 5) * r);

                     if(enemy[i].param % 30 === 0){
                         // starshotを調査
                         for(j = 0; j < starshot_count; j++){
                             if(!enemyShot[j].alive){
                                 // 新しいstarshot
                                 p = enemy[i].position.distance(chara.position);
                                 p.normalize();
                                 enemyShot[j].set(enemy[i].position, p, 5, 5);
                                 break;
                             }
                         }
                     }
                     // パスをいったん閉じる
                     ctx.closePath();
                 }
             }

             // 星の色を設定する
             ctx.fillStyle = starcolor;

             // 星を描く
             ctx.fill();

             ctx.beginPath();;

             for(i = 0; i < starshot_count; i++){
                 // starshotが発射されているかチェック
                 if(enemyShot[i].alive){
                     // starshotを動かす
                     enemyShot[i].move();

                     // starshotを描くパスを設定
                     ctx.arc(
                             enemyShot[i].position.x,
                             enemyShot[i].position.y,
                             enemyShot[i].size,
                             0, Math.PI * 2, false
                            );
                     // パスをいったん閉じる
                     ctx.closePath();
                 }}

             ctx.fillStyle = starshot_color;

             // enemyshotを描く
             ctx.fill();

             for(i = 0; i < myshot_count; i++){
                 // myshotの生存チェック
                 if(charaShot[i].alive){
                     // myshotと星との衝突判定
                     for(j = 0; j < star_count; j++){
                         // 星の生存チェック
                         if(enemy[j].alive){
                             // myshotと星との距離を計測
                             p = enemy[j].position.distance(charaShot[i].position);
                             if(p.length() < enemy[j].size){
                                 // 衝突していたら生存=false
                                 enemy[j].alive = false;
                                 charaShot[i].alive = false;
                                 score++;
                                 // 衝突があったのでループを抜ける
                                 break;
                             }
                         }
                     }					
                 }						
             }

             for(i = 0; i < starshot_count; i++){
                 // starshotの生存チェック
                 if(enemyShot[i].alive){
                     // 自分とstarshotとの距離を計測
                     p = chara.position.distance(enemyShot[i].position);
                     if(p.length() < chara.size){
                         // 衝突していたら生存=false
                         chara.alive = false;

                         // 衝突があったのでパラメータを変更してループを抜ける
                         run = false;
                         ctx.fillStyle="red";
                         ctx.textAlign="center";
                         ctx.fillText("Game Over",250 ,250);
                         ctx.font="50px ''";

                         break;
                     }
                 }
             }
             break;
     }

     // HTML更新
     info.innerHTML = 'SCORE: ' + (score * 10) + ' ' + message;

     // 再帰呼び出し
     if(run){setTimeout(arguments.callee, fps);}
    })();
};

function mouseMove(event){
    // マウスカーソル座標更新
    mouse.x = event.clientX - screenCanvas.offsetLeft;
    mouse.y = event.clientY - screenCanvas.offsetTop;
}

function keyDown(event){
    var ck = event.keyCode;
    if(ck === 13){run = false;}
}

function mouseDown(event){
    // フラグを立てる
    fire = true;
}
