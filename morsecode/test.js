// let mic, started = false;
// let fft, fftSize = 512;
// let freq = 1000;

// function setup(){
//     createCanvas(600, 300);
//     mic = new p5.AudioIn();
//     fft = new p5.FFT(0.8, fftSize);
//     fft.setInput(mic)
//     fill(0)
//     listen();
// }

// function draw(){
//     background(255);
//     if(started) {
//         let spec = fft.analyze()
//         let size = width/spec.length;
//         let index = floor(spec.length*freq/24000);
//         for (let i = 0; i < spec.length; i++) {
//             // if(i <= index-5 || i >= index+5) continue;
//             let val = map(spec[i], 0, 255, 0, height);
//             rect(i*size, height-val, size, val);
//         }
//     }
// }

// function listen(){
//     userStartAudio();
//     mic.start()
//     started = true;
// }