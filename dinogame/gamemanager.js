function gameover (){
  let gameover;
  if (!isLooping()) { 
    reloadbtn.show();
    textAlign(CENTER);
    fill(100);  
    textSize(40);
    gameover = text('G A M E  O V E R', width/2, height/3);
    reloadbtn.mouseClicked(restart)
  }
  function restart () {
    cactus = [];
    reloadbtn.hide();
    ground.x = 0;
    score = 0;
    loop();
  }
}




