let inputField;
let mic, isSound = true, isFlash = true, listening = false;
let osc, freq = 500, amp = 1
let timing = 300;
let thres = 0.3;
let recordedBin;
let fft, fftSize = 512;

let listenBtn = document.querySelector("#listenBtn");
let useFreq = document.querySelector("#usefreq")
let freqSlider = document.querySelector("#freqslider");
freqSlider.value = freq;
let freqText = document.querySelector("#freqtext");
freqText.value = freq;
freqText.addEventListener('change', freqInput);
freqSlider.addEventListener("change", sliderChange);
let outputBox = document.querySelector(".output");
let light = document.querySelector(".light");
let cnv1 = document.querySelector(".graph1");
let ctx1 = cnv1.getContext('2d');
ctx1.fillStyle = '#fff';
ctx1.fillRect(0, 0, cnv1.width, cnv1.height);
ctx1.fillStyle = '#000';
ctx1.fillRect(0, cnv1.height*(1-thres), cnv1.width, 1);

inputField = document.querySelector("#inputBox");
inputField.addEventListener('input', translate);
osc = new p5.Oscillator('sine');
osc.freq(freq);
osc.amp(1);

function setup(){
    canvasClose();
    mic = new p5.AudioIn()
    mic.start()
    fft = new p5.FFT(0, fftSize);
    fft.setInput(mic)
}

useFreq.addEventListener('change', () => {
    if(useFreq.checked) {
        freqSlider.disabled = false;
        freqText.disabled = false;
    } else {
        freqSlider.value = 500;
        freqSlider.disabled = true;
        freqText.value = 500;
        freqText.disabled = true;
        freq = 500;
    }
})

inputField.addEventListener('focus', () => {
    osc.start();
    setTimeout(() => {
        osc.stop();
    }, 30);
})
function lightFullScreen(){
    if(document.fullscreenElement && document.fullscreenElement == light) {
        document.exitFullscreen();
    } else {
        light.requestFullscreen();
    }
}

function translate(){
    let text = inputField.value;
    let out;
    if(text.replace(/[.\-/ _|]/g,'').length > 0){
        out = textToMorseSimple(text);
    } else {
        out = morseToTextSimple(text);
    }
    outputBox.innerHTML = out;
}
function generateSound(){
    let text = inputField.value;
    let morse;
    if(text.replace(/[.\-/ _|]/g,'').length > 0){
        morse = outputBox.innerHTML;
    } else {
        morse = text;
    }
    let bin = morseToBinary(morse);

    setTimeout(() => {
        osc.start();
        ctx1.fillStyle = '#fff';
        ctx1.fillRect(0, 0, cnv1.width, cnv1.height);
        ctx1.fillStyle = '#000';
        size = cnv1.width/bin.length;
        morseSound(bin);
    }, timing);
}

function morseSound(bin){
    if(bin == '') {
        osc.stop();
        return;
    }
    if(bin[0] == '1') {
        if(isSound) osc.amp(1);
        toggleLight(1);
    } else if (bin[0] == '0') {
        osc.amp(0);
        toggleLight(0);
    }
    setTimeout(() => {
        morseSound(bin.substring(1));
    }, timing);
}

function drawSound(bin, ampBin){
    ctx1.fillStyle = '#fff';
    ctx1.fillRect(0, 0, cnv1.width, cnv1.height);
    ctx1.fillStyle = "#000";
    let colSize = min(cnv1.width/bin.length, 20);
    for(var i = 0; i < bin.length; i++){
        if(bin[i] == '0') continue
        ctx1.fillRect(i*colSize, cnv1.height-ampBin[i]*100, colSize, ampBin[i]*100);
    }
}

function toggleLight(a){
    if(isFlash)
    light.style.backgroundColor = a==1? 'white':'black';
}

function toggleListen(){
    if(listening){
        listening = false;
        let cnvCont = document.querySelector("#cnvcontainer");
        listenBtn.innerHTML = "Listen"
        document.querySelector("#playBtn").disabled = false;
        document.querySelector("#soundBtn").disabled = false;
        document.querySelector("#flashBtn").disabled = false;
    }
    else {
        listening = true;
        let cnvCont = document.querySelector("#cnvcontainer");
        cnvCont.style.display = "block";
        cnvCont.style.transform = "scaleY(1)";
        listenBtn.innerHTML = "Listening..."
        document.querySelector("#playBtn").disabled = true;
        document.querySelector("#soundBtn").disabled = true;
        document.querySelector("#flashBtn").disabled = true;
        startListening();
    }
}

function startListening(){
    userStartAudio();
    mic.start();
    let interval;
    recordedBin = "";
    ctx1.fillStyle = "#fff";
    ctx1.fillRect(0, 0, cnv1.width, cnv1.height);
    ctx1.fillStyle = "#000";
    ctx1.fillRect(0, cnv1.height*(1-thres), cnv1.width, 1);
    let maxTime = 7;
    interval = setInterval(() => {
        if(mic.getLevel() > 0.2){
            clearInterval(interval)
            audioToBinary();
        }
        maxTime -= (10/1000);
        if(maxTime <= 0 || listening == false) {
            listenBtn.innerHTML = "Listen"
            document.querySelector("#playBtn").disabled = false;
            document.querySelector("#soundBtn").disabled = false;
            document.querySelector("#flashBtn").disabled = false;
            listening = false;
            clearInterval(interval);
        }
    }, 10);
}

function audioToBinary(){
    console.log("Recording started")
    let ampBin = [];
    setTimeout(() => {
        recordSound(0, ampBin);
    }, timing/2);
}
function recordSound(i, ampBin){
    if(!listening) return;
    if(recordedBin.substring(recordedBin.length-8, recordedBin.length) == '00000000') {
        doneListening();
        return;
    }
    let soundLevel;
    if(useFreq.checked){
        let spec = fft.analyze()
        let size = width/spec.length;
        let index = floor(spec.length*freq/24000);
        let maxLevel = 0;
        ctx1.fillStyle = '#fff';
        ctx1.fillRect(0, 0, cnv1.width, cnv1.height);
        ctx1.fillStyle = "#000";
        let colSize = cnv1.width/spec.length;
        for (let i = max(index-5, 0); i <= min(index+5, spec.length-1); i++) {
            let val = spec[i]/255;
            maxLevel = max(val, maxLevel);
        }
        soundLevel = maxLevel;
        if(maxLevel > thres) recordedBin += '1';
        else recordedBin += '0';
        console.log(maxLevel);
    } else {
        soundLevel = mic.getLevel();
        if(mic.getLevel() > thres) recordedBin += '1';
        else recordedBin += '0';
    }
    ampBin.push(soundLevel);
    drawSound(recordedBin, ampBin);
    setTimeout(() => {
        recordSound(++i, ampBin);  
    }, timing);
}

function toggleSound(e){
    if(isSound) {
        e.classList.remove("active");
        isSound = false;
    } else {
        e.classList.add("active");
        isSound = true;
    }
}
function toggleFlash(e){
    if(isFlash) {
        e.classList.remove("active");
        isFlash = false;
    } else {
        e.classList.add("active");
        isFlash = true;
    }
}
function doneListening(){
    mic.stop();
    listening = false;
    listenBtn.innerHTML = "Listen";
    document.querySelector("#playBtn").disabled = false;
    document.querySelector("#soundBtn").disabled = false;
    document.querySelector("#flashBtn").disabled = false;
    let morse = binaryToMorse(recordedBin);
    morse = morse.substring(0, morse.length-2)
    outputBox.innerHTML = morse;
    let text = morseToTextSimple(morse);
    inputField.value = text;
}

function sliderChange(e){
    freq = +e.target.value;
    osc.freq(freq);
    freqText.value = e.target.value;
}
function freqInput(e){
    freqSlider.value = e.target.value;
    freq = +e.target.value;
    osc.freq(freq);
}
function canvasClose(e){
    let cnvCont = document.querySelector("#cnvcontainer");
    cnvCont.style.transform = "scaleY(0)";
    setTimeout(() => {
        cnvCont.style.display = "none";
    }, 500);
}
