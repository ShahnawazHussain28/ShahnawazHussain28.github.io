let types = {
    input: 'INPUT',
    output: 'OUTPUT',
    and: 'AND',
    and3: 'AND3',
    or: 'OR',
    or3: 'OR3',
    not: 'NOT',
    nand: 'NAND',
    nand3: 'NAND3',
    nor: 'NOR',
    nor3: 'NOR3',
    xor: 'XOR',
    xnor: 'XNOR',
    srlatch: 'SR_LATCH',
    dlatch: "D_LATCH",
    register4: "REGISTER_4",
    junction: 'J',
    pulse: 'PULSE'
}
let operations = {
    INPUT: '',
    OUTPUT: 'a',
    AND: '(a & b)',
    AND3: '(a & b & c)',
    OR: '(a | b)',
    OR3: '(a | b | c)',
    NOT: '(!a)',
    NAND: '(!(a & b))',
    NAND3: '(!(a & b & c))',
    NOR: '(!(a | b))',
    NOR3: '(!(a | b | c))',
    XOR: '(a ^ b)',
    XNOR: '(!(a ^ b)',
    SR_LATCH: '!(!a & !(!b & o1))',
    D_LATCH: '',
    REGISTER_4: '',
    J: 'a',
    PULSE: ''
}
let nodeData = {};
let id = 0;
class Node{
    constructor(type, inp, out, x = 100, y = 100){
        this.id = Date.now() + id++;
        this.type = type;
        this.input = inp;
        this.output = out;
        this.x = x; this.y = y;
        this.h = (max(this.input, this.output) * 15) + 20;
        this.w = this.type.length * 10 + 30;
        this.outputNodes = new Array(out).fill(null);
        this.inputVal = new Array(this.input).fill(0);
        this.inputPos = evenlySpreadPoints(-this.w/2, -this.h/2, -this.w/2, this.h/2, this.input);
        this.outputPos = evenlySpreadPoints(this.w/2, -this.h/2, this.w/2, this.h/2, this.output);
        this.isCombinational = true;
    }
    move(x, y){
        this.x = x;
        this.y = y;
    }
    setInput(val, index){
        this.inputVal[index] = val;
    }
    show(col){
        fill(col?? '#333')
        rectMode(CENTER)
        rect(this.x, this.y, this.w, this.h)
        fill('#fff')
        textAlign(CENTER, CENTER)
        text(this.name != undefined? this.name : this.type, this.x, this.y)
        push();
        textAlign(RIGHT);
        for (let i = 0; i < this.outputPos.length; i++) {
            rect(this.x+this.outputPos[i].x, this.y+this.outputPos[i].y, 12, 10);
            if(this.outputNames?.[i]){
                text(this.outputNames[i], this.x+this.outputPos[i].x - 10, this.y+this.outputPos[i].y);
            }
        }
        textAlign(LEFT);
        for (let i = 0; i < this.inputPos.length; i++) {
            rect(this.x+this.inputPos[i].x, this.y+this.inputPos[i].y, 12, 10);
            if(this.inputNames?.[i]){
                text(this.inputNames[i], this.x+this.inputPos[i].x + 10, this.y+this.inputPos[i].y);
            }
        }
        pop();
        if(this.outputNodes){
            for (let i = 0; i < this.outputNodes.length; i++) {
                let out = this.outputNodes[i];
                if(!out) continue;
                line(this.x+this.outputPos[i].x, this.y+this.outputPos[i].y, out.node.x+out.node.inputPos[out.index].x, out.node.y+out.node.inputPos[out.index].y);
            }
        }
    }
}
class INPUT extends Node{
    constructor(x, y){
        super(types.input, 0, 1, x, y);
        this.state = false;
    }
    operate(){
        this.outputNodes[0]?.node.setInput(this.state? 1:0, this.outputNodes[0].index)
    }
    onclick(){
        this.state = !this.state;
    }
    show(){
        super.show(this.state? '#f44' : '#333');
    }
}
class PULSE extends Node{
    constructor(x, y){
        super(types.pulse, 0, 1, x, y);
        this.state = false;
        this.freq = 10;
    }
    operate(){
        if(frameCount % this.freq == 0){
            this.state = !this.state;
            this.outputNodes[0]?.node.setInput(this.state? 1:0, this.outputNodes[0].index)
        }
    }
    onclick(){
        this.freq = ((this.freq + 10) % 100) + 10;
    }
    show(){
        super.show(this.state? '#f44' : '#333');
    }
}
class OUTPUT extends Node{
    constructor(x, y){
        super(types.output, 1, 0, x, y);
        this.state = false;
    }
    operate(){
        this.state = Boolean(this.inputVal[0])
    }
    show(){
        super.show(this.state? '#f44' : '#333');
    }
}
class AND extends Node{
    constructor(x, y){
        super(types.and, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class AND_3 extends Node{
    constructor(x, y){
        super(types.and3, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class OR extends Node{
    constructor(x, y) {
        super(types.or, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class OR_3 extends Node{
    constructor(x, y) {
        super(types.or3, 3, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class NOT extends Node{
    constructor(x, y) {
        super(types.not, 1, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class NAND extends Node{
    constructor(x, y) {
        super(types.nand, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class NAND_3 extends Node{
    constructor(x, y) {
        super(types.nand3, 3, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class NOR extends Node{
    constructor(x, y) {
        super(types.nor, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class NOR_3 extends Node{
    constructor(x, y) {
        super(types.nor3, 3, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class XOR extends Node{
    constructor(x, y) {
        super(types.xor, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class XNOR extends Node{
    constructor(x, y) {
        super(types.xnor, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        this.outputNodes[0]?.node.setInput(eval(operations[this.type]), this.outputNodes[0].index);
    }
}
class SR_LATCH extends Node{
    constructor(x, y) {
        super(types.srlatch, 2, 2, x, y);
        this.outputVal = new Array(2).fill(0);
        this.inputNames = ['S', 'R'];
        this.outputNames = ['Q', "Q'"];
        this.isCombinational = false;
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        let o1 = this.outputVal[0], o2 = this.outputVal[1];
        let res = eval(operations[this.type]);
        let invalid = false;
        if(a == 1 && b == 1) invalid = true;
        this.outputVal[0] = invalid? 1 : res;
        this.outputVal[1] = invalid? 1 : !res;
        this.outputNodes[0]?.node.setInput(this.outputVal[0], this.outputNodes[0].index);
        this.outputNodes[1]?.node.setInput(this.outputVal[1], this.outputNodes[1].index);
    }
}
class D_LATCH extends Node{
    constructor(x, y){
        super(types.dlatch, 2, 1, x, y);
        this.outputVal = [0];
        this.inputNames = ['d', 's'];
        this.isCombinational = false;
    }
    operate(){
        if(this.inputVal[1] == 1){
            this.outputVal[0] = this.inputVal[0];
        }
        this.outputNodes[0]?.node.setInput(this.outputVal[0], this.outputNodes[0].index);
    }
}
class REGISTER_4 extends Node{
    constructor(x, y){
        super(types.register4, 6, 4, x, y);
        this.prevClock = 0;
        this.inputNames = ['a0','a1','a2','a3','store','clock']
        this.outputNames = ['a0','a1','a2','a3','store','clock']
        this.outputVal = new Array(4).fill(0);
        this.isCombinational = false;
    }
    operate(){
        let currClock = this.inputVal[5];
        if(this.prevClock == 0 && currClock == 1){
            if(this.inputVal[4] == 1){
                for(let i = 0; i < this.outputVal.length; i++){
                    this.outputVal[i] = this.inputVal[i];
                }
            }
        }
        for(let i = 0; i < this.outputNodes.length; i++){
            this.outputNodes[i]?.node.setInput(this.outputVal[i], this.outputNodes[i].index);
        }
        this.prevClock = currClock;
    }
    show(){
        super.show();
        let num = 0;
        for(let i = 0; i < this.outputVal.length; i++){
            num += (Math.pow(2, i) * this.outputVal[i]);
        }
        text(num, this.x, this.y - 30);
    }
}
class JUNCTION extends Node{
    constructor(x, y){
        super(types.junction, 1, 1, x, y)
    }
    operate(){
        this.outputNodes.forEach(out => {
            let a = this.inputVal[0];
            out?.node.setInput(eval(operations[this.type]), out.index);
        });
    }
    show(){
        push();
        fill("#333");
        rectMode(CENTER)
        rect(this.x, this.y, 60, 20, 50);
        fill('#000')
        circle(this.x+this.inputPos[0].x, this.y+this.inputPos[0].y, 12);
        circle(this.x+this.outputPos[0].x, this.y+this.outputPos[0].y, 12);
        if(this.outputNodes){
            for (let i = 0; i < this.outputNodes.length; i++) {
                let out = this.outputNodes[i];
                if(!out) continue;
                line(this.x+this.outputPos[0].x, this.y+this.outputPos[0].y, out.node.x+out.node.inputPos[out.index].x, out.node.y+out.node.inputPos[out.index].y);
            }
        }
        pop();
    }
}

function evenlySpreadPoints(x1, y1, x2, y2, n){
    let dtx = abs(x1 - x2) / n;
    let dty = abs(y1 - y2) / n;
    let points = [];
    for(let i = 1; i <= n; i++){
        let obj = {
            x: x1 + (i * dtx) - (dtx / 2),
            y: y1 + (i * dty) - (dty / 2),
        }
        points.push(obj);
    }
    return points;
}

class GROUP extends Node{
    constructor(name, inputs, outputs, boolfunctions, x, y){
        if(!types[name.toLowerCase()]){
            types[name.toLowerCase()] = name.toUpperCase();
            localStorage.setItem(localStorageTypesKey, JSON.stringify(types))
            operations[name.toUpperCase()] = boolfunctions;
            localStorage.setItem(localStorageOperationsKey, JSON.stringify(operations))
            nodeData[name.toUpperCase()] = {inputNames: inputs, outputNames: outputs} 
            localStorage.setItem(localStorageNodeKey, JSON.stringify(nodeData))
        }
        super(types[name.toLowerCase()], inputs.length, outputs.length, x, y);
        this.inputVal = new Array(inputs.length).fill(0);
        this.outputVal = new Array(outputs.length).fill(0);
        this.inputNames = inputs;
        this.outputNames = outputs;
        this.boolfunctions = boolfunctions;
    }
    operate(){
        for(let i = 0; i < this.outputNames.length; i++){
            let res = operations[this.type][i]
            for(let j = 0; j < this.inputNames.length; j++){
                res = res.replaceAll(this.inputNames[j], this.inputVal[j]);
            }
            this.outputVal[i] = eval(res.replaceAll(this.outputNames[i], this.outputVal[i]));
        }
        for(let i = 0; i < this.outputNodes.length; i++){
            if(!this.outputNodes[i]) continue;
            this.outputNodes[i].node.setInput(this.outputVal[i], this.outputNodes[i].index);
        }
    }
    clone(){
        return new GROUP(this.type, this.inputNames, this.outputNames, this.boolfunctions)
    }
    show(){
        super.show();
    }
}

function isInsideRect(cx, cy, w, h, x, y, tx = 0, ty = 0){
    return !(x-tx > cx+w/2 || x-tx < cx-w/2 || y-ty > cy+h/2 || y-ty < cy-h/2);
}