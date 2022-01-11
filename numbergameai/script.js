var max = 1000-1;
var min = 1;
var guess_count = 1;
let display = document.getElementById("display");
let high_btn = document.getElementById("high");
let low_btn = document.getElementById("low");
let correct_btn = document.getElementById("correct");
let popup = document.getElementById("popup");
let win = document.getElementById("win");
let aitext = document.getElementById("aitext");
let main = document.getElementById("main");
let popper = document.getElementsByClassName("popper");
let guessCount = document.getElementById("guess_count");
let replay = document.getElementById("replay");
let share_btn = document.getElementById("share");
let tutoback = document.getElementById("tutoback");
let tutorial = document.getElementById("tutorial");
feedback = "0";
old_feed = "1";
character = '0123456789#+*';
guess_count = 0;
anim_count = 0;
ai_text = ["I think it is", "Let me think.....", "I think I got the number", "It is maybe...", "Definately this one", 
           "It is", "Kabhi to 'correct' button daba do", "You are making me angry", "How could I be so wrong!", 
           "There must be technical issue in your mind"];


function aiTextDisplay () {
    index = Math.floor(Math.random()* (ai_text.length));
    if (guess_count < 4 && index >= ai_text.length - 4 ){
        index -= 5;
    }
    text = ai_text[index];
    aitext.innerHTML = "";
    var i = 0;
    function typeWrite () {
        if (i < text.length) { 
            aitext.innerHTML += text.charAt(i);
            setTimeout(typeWrite, 50);
            i++;
        }
    }
    typeWrite();
}


function out (max, min) {
    feedback = Math.floor(Math.random()*((max+1)-min) + min);
    display.innerHTML = feedback;
}

function error () {
    if(old_feed == feedback){
        if(window.confirm("You surely did Something INCORRECT")){
            restart();
        }
    }
}

function anim () {
    aiTextDisplay();
    guess_count++;
  var isPlaying = setInterval(animation, 70);
  function animation () {
    display.innerHTML = String(character.charAt(Math.floor(Math.random()*12)))
      +String(character.charAt(Math.floor(Math.random()*12)))+
        String(character.charAt(Math.floor(Math.random()*12)));
        high_btn.disabled = true;
        low_btn.disabled = true;
      anim_count ++;
    if (anim_count == 10) {
        clearInterval(isPlaying);
        old_feed = feedback;
        out(max, min);
        high_btn.disabled = false;
        low_btn.disabled = false;
        anim_count = 0;
        error();
    }
  }
}

function high () {
    max = feedback -1;
    anim();
}

function low () {
    min = feedback +1;
    anim();
}
function correct () {
    high_btn.disabled = true;
    low_btn.disabled = true;
    main.style.backgroundColor = "black";
    main.style.backgroundImage = "url('confetti.gif')";
    popper[0].style.display = "block";
    popper[1].style.display = "block";
    low_btn.style.opacity = "0.2";
    high_btn.style.opacity = "0.2";
    correct_btn.style.opacity = "0.2";
    circle.style.backgroundColor = "#29285c";
    circle.style.boxShadow = "inset 0px 0px 50px 5px #280028";
    display.style.fontSize = "52px";
    display.style.color = "white";
    aitext.innerHTML = "Yaaayyyyy I did it !";
    guessCount.innerHTML = guess_count;
    setTimeout(function(){
               win.style.display = "block";
               }, 3000);
    win.style.animation = "fadeout 0.7s reverse 1";
    
}

function start () {
    popup.style.animation = "fadeout 0.7s linear 1";
    setTimeout(function(){
        popup.style.display = "none";
    }, 700);
}
function quit () {
    window.history.back();
}

function restart () {
    location.reload();
}
function share () {
    var url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: 'SHAHNAWAZ28',
            text: "This A.I is so smart! Play a GAME with this A.I \n" ,
            url: url,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
}
function tuto () {
    tutoback.style.animation = "fadeout 0.4s linear 1";
    setTimeout(function(){
        tutoback.style.display = "none";
    }, 400);
    anim();
}


window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
}
