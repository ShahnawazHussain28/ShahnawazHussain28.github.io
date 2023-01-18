let truthTable = []
let sequence = [];
let varCount = 2;
let variables = "ABCDEFGH";
let kMap = [], cellSize = 100, row = 1, col = 1, offsetX = 0, offsetY = 0;

function setup(){
    let cnvSize = windowWidth < 500 ? windowWidth - 20 : 600
    cellSize = cnvSize / 6;
    createCanvas(cnvSize, cnvSize)
    background(51)
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(cellSize*22/100)
    stroke(255);
    fill(255);
    displayTable()
}

function mousePressed(){
    let i = Math.floor((mouseX-cellSize/4)/(cellSize)) - 1;
    let j = Math.floor((mouseY-cellSize/4)/(cellSize)) - 1;
    if(row == 2) j--;
    if(col == 2) i--;
    if(varCount == 5) j -= 2;
    if(i < 0 || i >= col || j < 0 || j >= row) return;
    let bin = sequence[j] + sequence[i];
    let idx = binaryToDecimal(bin);
    let elt = document.getElementsByClassName("outputvals")[idx];
    elt.value = elt.value == 0 ? 1 : (elt.value == 1 ? 'x' : 0)
    writeMinterms()
    createKMap()
}

function isSafe(i, j){
    return !(i < 0 || i >= kMap[0].length || j < 0 || j >= kMap.length || kMap[j][i] == 0);
}
function isRightSafe(w, h, i, j){
    for(let k = 0; k < h; k++){
        if(!isSafe(i+w, j+k)) return false;
    }
    return true;
}

function solveKMap(){
    let func = getIslands();
    let functionContainer = document.getElementById("booleanfunction");
    functionContainer.innerHTML = simplifyBooleanFunction(func);
    functionContainer.classList.add('active')
    document.getElementById("notebook").classList.add('active')
}
function simplifyBooleanFunction(func){
    if(func == 0 || func == 1) return func
    func = func.replace(/\s/g, '');
    let upperCasedFunc = func.replace(/A'/g, 'a').replace(/B'/g, 'b').replace(/C'/g, 'c').replace(/D'/g, 'd').replace(/E'/g, 'e').replace(/F'/g, 'f')
    funcList = upperCasedFunc.split("+");
    let iter = 4;
    while(iter-- > 0){
        for(let i = 0; i < funcList.length; i++){
            for(let j = i+1; j < funcList.length; j++){
                let first = funcList[i];
                let second = funcList[j];
                let xorxnor = checkXORXNOR(first, second)
                if(xorxnor){
                    funcList.splice(j, 1);
                    funcList[i] = xorxnor;
                    continue;
                }
                let common = (first.match(new RegExp('['+second+']', 'g')) || []).join('');
                if(common == '') continue;
                let rem1 = first.replace(new RegExp('['+common+']', 'g'), '')
                let rem2 = second.replace(new RegExp('['+common+']', 'g'), '')
                if(rem1 == '' || rem2 == '') {
                    // a(1 + b) // = a
                    funcList.splice(j, 1);
                    funcList[i] = common;
                } else if(rem1.length == 1){
                    // a(b + b') // = a
                    if(checkInvert(rem1, rem2)){
                        funcList.splice(j, 1);
                        funcList[i] = common;
                    }
                } else if(rem1.length == 2){
                    // (ab'+a'b) = a ^ b //// (ab +a'b') = !(a ^ b) //
                    let xorxnor = checkXORXNOR(rem1, rem2)
                    if(xorxnor){
                        funcList.splice(j, 1);
                        funcList[i] = `${common}${xorxnor}`;
                        continue;
                    }
                }
            }
            if(funcList[i] == ''){
                funcList.splice(i, 1);
            }
        }
    }
    // Taking common to minimize AND Gate
    for(let i = 0; i < funcList.length; i++){
        for(let j = i+1; j < funcList.length; j++){
            let first = funcList[i];
            let second = funcList[j];
            let firstInsideBrackets = first.match(/\(.+\)/g)?.join('');
            let common, rem1, rem2;
            if(firstInsideBrackets){
                common = second.match(firstInsideBrackets) ? firstInsideBrackets : '';
                if(common == '') second.match(first.replace(firstInsideBrackets, '')) ? first.replace(firstInsideBrackets, '') : '';
                if(common == '') continue;
                rem1 = first.replace(common, '');
                rem2 = second.replace(common, '');
                funcList[i] = `${common}(${rem1.replace(/[\(\)]/g, '')}+${rem2.replace(/[\(\)]/g, '')})`
                funcList.splice(j, 1);
            } else {
                common = (first.match(new RegExp('['+second+']', 'g')) || []).join('');
                if(common == '') continue;
                rem1 = first.replace(new RegExp('['+common+']', 'g'), '')
                rem2 = second.replace(new RegExp('['+common+']', 'g'), '')
                funcList[i] = `${common}(${rem1}+${rem2})`
                funcList.splice(j, 1);
            }
            console.log(funcList)
        }
    }
    let res = funcList.join(" + ")
    res = res.replace(/\w/g, (match) => `${match.toUpperCase()}${isLowerCase(match)? "'" : ''}`)
    return res;
}
  
function checkXORXNOR(a, b){
    if(a.length < 2 || b.length < 2) return false;
    if(a.length == 2 && b.length == 2) {
        if(checkInvert(a, b)){
            if(!isUpperCase(a) && !isLowerCase(a)) return `(${a[0].toUpperCase()}^${a[1].toUpperCase()})`;
            else return `(${a[0].toUpperCase()}^${a[1].toUpperCase()})'`;
        }
    } else{
        let first = a.match(/\(\w*\^*\+*\w*\)\'*/g)?.[0]
        let second = b.match(/\(\w*\^*\+*\w*\)\'*/g)?.[0]
        if(!first || !second) return false;
        if(first[first.length-1] == second[second.length-1]) return false;
        a = a.replace(first, '')
        b = b.replace(second, '')
        if(!checkInvert(a, b)) return false;
        if((isLowerCase(a) && first[first.length-1] != "'") || (isUpperCase(a) && first[first.length-1] == "'")) return `(${a.toUpperCase()}^${first[first.length-1] == "'"? first.substring(0, first.length-1) : first})`;
        else return `(${a.toUpperCase()}^${first[first.length-1] == "'"? first.substring(0, first.length-1) : first})'`; 
    }
}
function isUpperCase(a){
    for(let i = 0; i < a.length; i++) if(a[i] != a[i].toUpperCase()) return false;
    return true;
}
function isLowerCase(a){
    for(let i = 0; i < a.length; i++) if(a[i] != a[i].toLowerCase()) return false;
    return true;
}
function checkInvert(a, b){
    if(a.length != b.length) return false;
    for(let i = 0; i < a.length; i++){
        if(a[i].match(/\W/)) continue;
        if(a[i].toUpperCase() != b[i].toUpperCase()) return false;
        if((a[i] == a[i].toUpperCase() && b[i] == b[i].toLowerCase()) || (a[i] == a[i].toLowerCase() && b[i] == b[i].toUpperCase())){}
        else return false;
    }
    return true;
}
function getIslands(){
    let islands = [];
    for(let j = 0; j < row; j++){
        for(let i = 0; i < col; i++){
            if(!isSafe(i, j)) continue;
            islands.push(makeIslandObject(i, j, i, j));
            let w = 1, h = 1;
            while(isSafe(i, j + h - 1)){
                if(Math.log2(h) % 1 != 0) {
                    h++;
                    continue;
                }
                w = 1;
                while(true){
                    if(!isRightSafe(w, h, i, j)){
                        if(Math.log2(w) % 1 == 0){
                            islands.push(makeIslandObject(i, j, i+w-1, j+h-1));
                            break;
                        } else {
                            let newW = w;
                            while(Math.log2(newW) % 1 != 0) newW--;
                            islands.push(makeIslandObject(i, j, i+newW-1, j+h-1));
                            break;
                        }
                    }
                    w++;
                }
                h++;
            }
        }
    }
    if(islands.length == 0) return '0';
    islands.sort((a,b) => b.area - a.area);
    return createBooleanFunction(islands);
}
function createBooleanFunction(islands){
    let output = "";
    let visited = new Array(row);
    for(let i = 0; i < row; i++) visited[i] = new Array(col).fill(false);
    islands = islands.filter(island => {
        for(let j = island.start.y; j <= island.end.y; j++){
            for(let i = island.start.x; i <= island.end.x; i++){
                if(kMap[j][i] != 'x') return true;
            }
        }
        return false;
    })
    islands = islands.filter(island => {
        let flag = false;
        for(let j = island.start.y; j <= island.end.y; j++){
            for(let i = island.start.x; i <= island.end.x; i++){
                if(visited[j][i] == false) {
                    visited[j][i] = true;
                    flag = true;
                }
            }
        }
        return flag;
    });
    islands = removeRedundantIslands(islands);
    drawKMapIslands(islands);
    drawKMapOutputs(false);
    islands.forEach(island => {
        let rowVarCount = Math.floor(varCount/2);
        let colVarCount = varCount - rowVarCount;
        let rowVar = variables.substring(0, rowVarCount);
        let colVar = variables.substring(rowVarCount, rowVarCount + colVarCount);
        let rowSequence = sequence.slice(island.start.y, island.end.y+1);
        for(let v = 0; v < rowVarCount; v++){
            let currVarVal = rowSequence[0][rowSequence[0].length - rowVarCount + v];
            for(let i = 1; i < rowSequence.length; i++){
                if(rowSequence[i][rowSequence[i].length - rowVarCount + v] != currVarVal) currVarVal = '';
            }
            if(currVarVal == '0') output += (rowVar[v] + "'")
            else if(currVarVal == '1') output += (rowVar[v])
        }
        let colSequence = sequence.slice(island.start.x, island.end.x+1);
        for(let v = 0; v < colVarCount; v++){
            let currVarVal = colSequence[0][v];
            for(let i = 1; i < colSequence.length; i++){
                if(colSequence[i][v] != currVarVal) currVarVal = '';
            }
            if(currVarVal == '0') output += (colVar[v] + "'")
            else if(currVarVal == '1') output += (colVar[v])
        }
        output += " + ";
    });
    if(output.substring(output.length-3) == ' + ') output = output.substring(0, output.length-3)
    if(output == '') output = '1'
    return output;
}
function removeRedundantIslands(islands){
    for(let i = islands.length-1; i >= 0; i--){
        let isRedundant = true;
        let complementMap = new Array(row)
        for(let j = 0; j < row; j++){
            complementMap[j] = new Array(col);
            for(let i = 0; i < col; i++){
                complementMap[j][i] = Number(!kMap[j][i])
            }
        }
        let island = islands[i];
        islands.forEach(land => {
            if(land == island) return
            for(let y = land.start.y; y <= land.end.y; y++){
                for(let x = land.start.x; x <= land.end.x; x++){
                    complementMap[y][x] = 1;
                }
            }
        });
        for(let j = 0; j < row; j++){
            if(complementMap[j].every(val => val == 1) == false){
                isRedundant = false;
                break;
            }
        }
        if(isRedundant) islands.splice(i, 1)
    }
    return islands;
}
function makeIslandObject(x1, y1, x2, y2){
    return {start: {x: x1, y: y1}, end: {x: x2, y: y2}, area: (x2-x1+1)*(y2-y1+1)};
}

function createKMap(){ 
    kMap = new Array(row);
    for(let i = 0; i < row; i++) kMap[i] = new Array(col).fill(0);
    let outputNodes = document.getElementsByClassName("outputvals")
    let outputs = [];
    for(let i = 0; i < outputNodes.length; i++) outputs.push(outputNodes[i].value)
    for(let k = 0; k < outputs.length; k++){
        if(outputs[k] == 0) continue
        let corrInp = truthTable[k][0].join('');
        let {i, j} = get2dIndex(corrInp, col)
        kMap[j][i] = outputs[k];
    }
    drawKMap()
}
function writeMinterms(){
    let outputvals = document.getElementsByClassName("outputvals")
    let m = [], d = [];
    outputvals.forEach((out, i) => {
        if(out.value == 1) m.push(i);
        else if(out.value == 'x') d.push(i)
    })
    document.getElementById("minterm").value = m.join(",")
    document.getElementById("dontcare").value = d.join(",")
}

function drawKMap(){
    let tableWidth = {x: cellSize*col, y: cellSize*row};
    sequence = []
    for(let i = 0; i < col; i++) sequence.push(binaryToGray(decimalToBinary(i, Math.log2(col))))
    background(51);
    push();
    translate(width/2 + cellSize/(width>590? 4 : 2), height/2 + cellSize/(width>590? 4 : 2));
    for (let i = 0; i < row + 1; i++) {
        line(-tableWidth.x/2 - 50, (i*cellSize)-offsetY, tableWidth.x / 2, (i*cellSize)-offsetY)
        if(i < row)
        text(sequence[i].substring(sequence[i].length-Math.log2(row)), -tableWidth.x/2 - 25, (i*cellSize)-offsetY + cellSize/2);
    }
    for (let i = 0; i < col + 1; i++) {
        line((i*cellSize)-offsetX, -tableWidth.y/2 - 50, (i*cellSize)-offsetX, tableWidth.y/2)
        if(i < col)
        text(sequence[i].substring(sequence[i].length-Math.log2(col)), (i*cellSize)-offsetX  + cellSize/2, -tableWidth.y/2 - 25);
    }
    let extendSize = width > 590 ? 50 : 40;
    line(-tableWidth.x/2, -tableWidth.y/2, -tableWidth.x/2 - extendSize, -tableWidth.y/2 - extendSize)
    text(variables.substring(0, Math.log2(row)), -tableWidth.x/2 - extendSize, -tableWidth.y/2 - 10);
    text(variables.substring(Math.log2(row), varCount), -tableWidth.x/2 - 30, -tableWidth.y/2 - extendSize);
    pop();
    drawKMapOutputs();
}
function drawKMapOutputs(bg = true){
    push();
    translate(width/2 + cellSize/(width>590? 4 : 2), height/2 + cellSize/(width>590? 4 : 2));
    for(let j = 0; j < row; j++){
        for(let i = 0; i < col; i++){
            if(bg){
                if(kMap[j]?.[i] == 1){
                    fill('red')
                    rect((i*cellSize)-offsetX+cellSize/2, (j*cellSize)-offsetY+cellSize/2, cellSize, cellSize)
                } else if(kMap[j]?.[i] == 'x'){
                    fill(255, 100, 100)
                    rect((i*cellSize)-offsetX+cellSize/2, (j*cellSize)-offsetY+cellSize/2, cellSize, cellSize)
                }
            }
            fill(255)
            text(kMap[j]?.[i], (i*cellSize)-offsetX  + cellSize/2, (j*cellSize)-offsetY + cellSize/2);
        }
    }
    pop();
}
function drawKMapIslands(islands){
    push();
    rectMode(CORNER);
    translate(width/2 + cellSize/(width > 590? 4 : 2), height/2 + cellSize/(width > 590? 4 : 2));
    fill(100, 100);
    islands.forEach(island => {
        let i = island.start.x;
        let j = island.start.y;
        let w = island.end.x - i;
        let h = island.end.y - j;
        rect((i*cellSize)-offsetX + cellSize/6, (j*cellSize)-offsetY + cellSize/6, (w+1)*cellSize - cellSize/3, (h+1)*cellSize - cellSize/3, 10)
    });
    pop();
}
function displayTable(){
    varCount = document.getElementById("varcount").value;
    if(varCount == '' || varCount < 2) {
        varCount = 2;
        document.getElementById("varcount").value = '';
    } else if(varCount > 5){
        alert("Value is too large");
        varCount = 5;
        document.getElementById("varcount").value = 5;
    }
    let possibleCombinations = Math.pow(2, varCount);
    row = Math.pow(2, Math.floor(varCount / 2));
    col = Math.pow(2, Math.ceil(varCount / 2));
    kMap = new Array(row).fill(new Array(col).fill(0))
    cellSize = varCount > 4 ? width/10 : width/6;
    offsetY = (row/2) * cellSize;
    offsetX = (col/2) * cellSize;
    let parent = document.getElementById("displayinput");
    truthTable = [];
    parent.innerHTML = `<div class="row"><span class="decimal"> </span><span class="binary">${"ABCDEF".substring(0, varCount)}</span></div><hr>`;
    for(let i = 0; i < possibleCombinations; i++){
        let bin = decimalToBinary(i, varCount);
        truthTable.push([bin.split(""), [0]]);
        parent.innerHTML += `<div class="row"><span class="decimal">${i}: </span><span class="binary">${bin}:</span> <input type="button" value="0" class="outputvals" onclick="changeOutput(${i.toString()}, this.value, this)"/></div>`;
    }
    drawKMap()
}
function changeOutput(index, val, elt){
    let newVal = val == 0 ? 1 : (val == 1 ? 'x' : 0)
    elt.value = newVal;
    truthTable[index][1][0] = newVal;
    writeMinterms()
    createKMap();
}
function applyMinterms(elt){
    let val = elt.value.replace(/\s/g, '')
    let terms = val.split(",").map(t => Number(t))
    terms = terms.filter(t => t !== '').map(t => Number(t))
    terms.sort((a, b) => a - b)
    let maximumTerm = terms[terms.length-1];
    if(maximumTerm >= 32) {
        alert("Either there is a typo or number of variables is too large");
        elt.value = '';
        return;
    }
    if(maximumTerm == '') maximumTerm = 2;
    let varCountDisplay = document.getElementById("varcount")
    let prevVal = varCountDisplay.value;
    varCountDisplay.value = maximumTerm < 2? 2 : Math.ceil(Math.log2(Number(maximumTerm)+1));
    if(varCountDisplay.value != prevVal){
        displayTable()
    }
    let dontcares = document.getElementById("dontcare").value.split(",").filter(dc => dc !== '').map(t => Number(t));
    dontcares.sort()
    let intersection = dontcares.filter(dc => terms.includes(dc));
    if(intersection.length > 0){
        intersection.forEach(val => {
            terms.splice(terms.indexOf(val))
        });
        elt.value = terms.join(",");
    }
    let outputVals = document.getElementsByClassName("outputvals");
    let pointer1 = 0, pointer2 = 0;
    dontcares.forEach(dc => {
        outputVals[dc].value = 'x';
    });
    console.log(terms, dontcares)
    while(pointer1 < outputVals.length  && terms[pointer2] != undefined){
        outputVals[pointer1].value = outputVals[pointer1].value == 1? 0 : outputVals[pointer1].value;
        console.log(outputVals[pointer1].value)
        if(pointer1 == terms[pointer2]){
            outputVals[terms[pointer2]].value = 1;
            pointer2++;
        }
        pointer1++;
    }
    createKMap();
}
function applyDontCares(elt){
    let val = elt.value.replace(/\s/g, '')
    let terms = val.split(",").map(t => Number(t))
    terms = terms.filter(t => t !== '').map(t => Number(t))
    terms.sort((a, b) => a - b)
    let minterms = document.getElementById("minterm").value.split(",").filter(mt => mt !== '').map(t => Number(t));
    minterms.sort()
    let intersection = minterms.filter(mt => terms.includes(mt));
    if(intersection.length > 0){
        intersection.forEach(val => {
            terms.splice(terms.indexOf(val))
        });
        elt.value = terms.join(",");
    }
    let outputVals = document.getElementsByClassName("outputvals");
    let pointer1 = 0, pointer2 = 0;
    while(pointer1 < outputVals.length && terms[pointer2] != undefined){
        outputVals[pointer1].value = outputVals[pointer1].value == 'x'? 0 : outputVals[pointer1].value;
        console.log("")
        if(pointer1 == terms[pointer2]){
            console.log(pointer1)
            outputVals[terms[pointer2]].value = 'x';
            console.log(outputVals[pointer1].value)
            pointer2++;
        }
        pointer1++;
    }
    createKMap();
}

function decimalToBinary(x, fixedLengthSize = 0){
    let res = "";
    while(x > 0){
        let rem = x % 2;
        res = rem.toString() + res;
        x = Math.floor(x / 2);
    }
    if(fixedLengthSize > res.length){
        let pad = fixedLengthSize - res.length;
        for(let i = 0; i < pad; i++) res = "0" + res;
    }
    return res;
}

function get2dIndex(bin){
    let rowVar = Math.floor(varCount / 2);
    let rowBin = bin.substring(0, rowVar), colBin = bin.substring(rowVar);
    let rowGray = binaryToGray(rowBin);
    let colGray = binaryToGray(colBin);
    return {i: binaryToDecimal(colGray), j: binaryToDecimal(rowGray)};
}

function binaryToGray(bin){
    let prefix = ''
    if(bin.length == 3 && bin[0] == '1'){
        prefix = '1';
        bin = bin.substring(1);
    }
    let gray = bin[0];
    for(let i = 1; i < bin.length; i++){
        gray += bin[i-1] ^ bin[i];
    }
    return prefix + gray;
}

function grayToBinary(gray){
    let bin = gray[0];
    for(let i = 1; i < gray.length; i++){
        bin += bin[i-1] ^ gray[i];
    }
    return bin;
}
function binaryToDecimal(bin){
    let res = 0;
    for(let i = bin.length-1; i >= 0; i--) res += (Math.pow(2, bin.length-1 - i) * bin[i])
    return res;
}