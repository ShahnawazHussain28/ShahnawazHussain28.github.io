let transMorse = {
    'a': '.-',
    'b': '-...',
    'c': '-.-.',
    'd': '-..',
    'e': '.',
    'f': '..-.',
    'g': '--.',
    'h': '....',
    'i': '..',
    'j': '.---',
    'k': '-.-',
    'l': '.-..',
    'm': '--',
    'n': '-.',
    'o': '---',
    'p': '.--.',
    'q': '--.-',
    'r': '.-.',
    's': '...',
    't': '-',
    'u': '..-',
    'v': '...-',
    'w': '.--',
    'x': '-..-',
    'y': '-.--',
    'z': '--..',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '0': '-----',
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    '!': '-.-.--',
    ':': '---...',
    '"': '.-..-.',
    '`': '.----.',
    '=': '-...-',
    '/': '-..-.',
    '(': '-.--.',
    ')': '-.--.-',
    '&': '.-...',
    ';': '-.-.-.',
    '+': '.-.-.',
    '-': '-....-',
    '_': '..--.-',
    '$': '...-..-',
    '@': '.--.-.'
}

let transEng = {
    '.-': 'a',
    '-...': 'b',
    '-.-.': 'c',
    '-..': 'd',
    '.': 'e',
    '..-.': 'f',
    '--.': 'g',
    '....': 'h',
    '..': 'i',
    '.---': 'j',
    '-.-': 'k',
    '.-..': 'l',
    '--': 'm',
    '-.': 'n',
    '---': 'o',
    '.--.': 'p',
    '--.-': 'q',
    '.-.': 'r',
    '...': 's',
    '-': 't',
    '..-': 'u',
    '...-': 'v',
    '.--': 'w',
    '-..-': 'x',
    '-.--': 'y',
    '--..': 'z',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '-----': '0',
    '.-.-.-': '.',
    '--..--': ',',
    '..--..': '?',
    '-.-.--': '!',
    '---...': ':',
    '.-..-.': '"',
    '.----.': '`',
    '-...-': '=',
    '-..-.': '/',
    '-.--.': '(',
    '-.--.-': ')',
    '.-...': '&',
    '-.-.-.': ';',
    '.-.-.': '+',
    '-....-': '-',
    '..--.-': '_',
    '...-..-': '$',
    '.--.-.': '@'
}

function morseToTextSimple(morse) {
    let words = morse.split("/")
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/\s+/g, ' ').trim();
        words[i] = words[i].replace(/_/g, '-');
    }
    for (var i = 0; i < words.length; i++) {
        var arrayOfLetters = words[i].split(' ');
        words[i] = arrayOfLetters;
    }
    let text = "";
    for (var i = 0; i < words.length; i++) {
        if(words[i] == '') continue;
        for (var j = 0; j < words[i].length; j++) {
            text += transEng[words[i][j]];
        }
        text += " ";
    }
    text = text.trim();
    return text;
}
function textToMorseSimple(text) {
    text = text.replace(/\s+/g, ' ').trim();
    text = text.toLowerCase();
    let words = text.split(" ");
    let morse = "";
    for (var i = 0; i < words.length; i++) {
        for (var j = 0; j < words[i].length; j++) {
            morse += transMorse[words[i][j]];
            morse += " ";
        }
        morse += "/ ";
    }
    morse = morse.replace(/\s+/g, ' ').trim();
    morse = morse.substring(0, morse.length - 2);
    return morse;
}

function morseToBinary(morse) {
    let bin = "";
    let words = morse.split("/")
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/\s+/g, ' ').trim();
    }
    for (var i = 0; i < words.length; i++) {
        for (var j = 0; j < words[i].length; j++) {
            if (words[i][j] == ".") bin += '10';
            else if (words[i][j] == "-") bin += '1110';
            else if (words[i][j] == " ") bin += '000';
        }
        if (i < words.length - 1) bin += '0000000';
    }
    return bin;
}
function binaryToMorse(bin){
    let morse = "";
    let i = 0;
    while(i < bin.length){
        if (bin[i] == '1' && bin[i+1] == '0'){
            morse += '.';
            i += 2;
        } else if(bin[i] == '1' && bin[i+1] == '1' && bin[i+2] == '1' && bin[i+3] == '0'){
            morse += '-';
            i += 4;
        } else if(bin.substring(i, i+7) == '0000000'){
            morse += ' / ';
            i += 7;
        } else if(bin[i] == '0' && bin[i+1] == '0' && bin[i+2] == '0'){
            morse += ' ';
            i += 3;
        } else {
            i++;
        }
    }
    return morse;
}

function morseToText(morse) {
    let morseWordArr = [];
    let morseWord = [];
    let morseLetter = "";
    let consecutiveSpaces = 0;
    for (let i = 0; i < morse.length; i++) {
        if (morse[i] == ' ') {
            consecutiveSpaces++;
            if (consecutiveSpaces == 3) {
                morseWord.push(morseLetter);
                morseLetter = "";
            } else if (consecutiveSpaces == 7) {
                morseWordArr.push(morseWord);
                morseWord = [];
            }
        } else {
            morseLetter += morse[i];
            consecutiveSpaces = 0;
        }
    }
    if (morseLetter != '') morseWord.push(morseLetter);
    if (morseWord.length != 0) morseWordArr.push(morseWord);
    let text = "";
    for (var j = 0; j < morseWordArr.length; j++) {
        for (var i = 0; i < morseWordArr[j].length; i++) {
            text += transEng[morseWordArr[j][i]];
        }
        text += " ";
    }
    return text;
}

function textToMorse(text) {
    let words = text.split(" ");
    let morse = "";
    for (var i = 0; i < words.length; i++) {
        for (var j = 0; j < words[i].length; j++) {
            morse += transMorse[words[i][j]];
            if (j < words[i].length - 1) morse += "   ";
        }
        if (i < words.length - 1) morse += "       ";
    }
    return morse;
}
