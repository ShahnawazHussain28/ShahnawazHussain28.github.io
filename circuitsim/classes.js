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
    dflipflop: "D_FLIPFLOP",
    jkflipflop: "JK_FLIPFLOP",
    register4: "REGISTER_4",
    display: "DISPLAY",
    displayDriver: "DISPLAY_DRIVER",
    junction: 'J',
    pulse: 'PULSE',
    negedgepulse: 'NEG_EDGE',
    posedgepulse: 'POS_EDGE'
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
    XNOR: '(!(a ^ b))',
    SR_LATCH: '!(!a & !(!b & o1))',
    D_LATCH: '',
    D_FLIPFLOP: '',
    JK_FLIPFLOP: '',
    REGISTER_4: '',
    DISPLAY: '',
    DISPLAY_DRIVER: '',
    J: 'a',
    PULSE: '',
    NEG_EDGE: '',
    POS_EDGE: '',
}
let nodeData = {};
let id = 0;
class Node{
    constructor(type, inp, out, x = 100, y = 100, w, h){
        this.id = Date.now() + id++;
        this.type = type;
        this.input = inp;
        this.output = out;
        this.x = x; this.y = y;
        this.h = h ?? (max(this.input, this.output) * 15) + 20;
        this.w = w ?? this.type.length * 10 + 30;
        this.outputNodes = new Array(out).fill(null);
        this.inputVal = new Array(this.input).fill(0);
        this.inputPos = evenlySpreadPoints(-this.w/2, -this.h/2, -this.w/2, this.h/2, this.input);
        this.outputPos = evenlySpreadPoints(this.w/2, -this.h/2, this.w/2, this.h/2, this.output);
        this.isCombinational = true;
        this.gateDelay = 10;
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
        text(this.name != undefined? this.name.replace("_", "\n") : this.type.replace("_", "\n"), this.x, this.y)
        push();
        textAlign(RIGHT);
        textSize(10)
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
        super.show(this.state? '#922' : '#333');
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
        super.show(this.state? '#922' : '#333');
    }
}
class NEG_EDGE_PULSE extends Node{
    constructor(x, y){
        super(types.negedgepulse, 1, 1, x, y);
        this.state = false;
        this.freq = 10;
        this.prevState = false;
        this.inputConnected = false;
    }
    operate(){
        if(this.inputConnected == false){
            if(frameCount % this.freq == 0){
                this.state = !this.state;
            }
        } else {
            this.state = this.inputVal[0];
        }
        this.outputNodes[0]?.node.setInput(0, this.outputNodes[0].index)
        if(this.prevState == 1 && this.state == 0)
        this.outputNodes[0]?.node.setInput(1, this.outputNodes[0].index)
        this.prevState = this.state;
    }
    onclick(){
        this.freq = ((this.freq + 10) % 100) + 10;
    }
    show(){
        super.show(this.state? '#922' : '#333');
    }
}
class POS_EDGE_PULSE extends Node{
    constructor(x, y){
        super(types.posedgepulse, 1, 1, x, y);
        this.state = false;
        this.freq = 10;
        this.prevState = false;
        this.inputConnected = false;
    }
    operate(){
        if(this.inputConnected == false){
            if(frameCount % this.freq == 0){
                this.state = !this.state;
            }
        } else {
            this.state = this.inputVal[0];
        }
        this.outputNodes[0]?.node.setInput(0, this.outputNodes[0].index)
        if(this.prevState == 0 && this.state == 1)
            this.outputNodes[0]?.node.setInput(1, this.outputNodes[0].index)
        this.prevState = this.state;
    }
    onclick(){
        this.freq = ((this.freq + 10) % 100) + 10;
    }
    show(){
        super.show(this.state? '#922' : '#333');
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
        super.show(this.state? '#922' : '#333');
    }
}
class AND extends Node{
    constructor(x, y){
        super(types.and, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class AND_3 extends Node{
    constructor(x, y){
        super(types.and3, 3, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class OR extends Node{
    constructor(x, y) {
        super(types.or, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class OR_3 extends Node{
    constructor(x, y) {
        super(types.or3, 3, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NOT extends Node{
    constructor(x, y) {
        super(types.not, 1, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NAND extends Node{
    constructor(x, y) {
        super(types.nand, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NAND_3 extends Node{
    constructor(x, y) {
        super(types.nand3, 3, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NOR extends Node{
    constructor(x, y) {
        super(types.nor, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NOR_3 extends Node{
    constructor(x, y) {
        super(types.nor3, 3, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1], c = this.inputVal[2];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class XOR extends Node{
    constructor(x, y) {
        super(types.xor, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class XNOR extends Node{
    constructor(x, y) {
        super(types.xnor, 2, 1, x, y);
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class SR_LATCH extends Node{
    constructor(x, y) {
        super(types.srlatch, 2, 2, x, y);
        this.outputVal = [0, 0];
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
        propagateOutput(this.outputNodes[0], this.outputVal[0], this.gateDelay)
        propagateOutput(this.outputNodes[1], this.outputVal[1], this.gateDelay)
    }
}
class D_LATCH extends Node{
    constructor(x, y){
        super(types.dlatch, 2, 2, x, y);
        this.outputVal = [0, 0];
        this.inputNames = ['Q', 'clk'];
        this.isCombinational = false;
    }
    operate(){
        if(this.inputVal[1] == 1){
            this.outputVal[0] = this.inputVal[0];
            this.outputVal[1] = !this.outputVal[0];
        }
        propagateOutput(this.outputNodes[0], this.outputVal[0], this.gateDelay)
        propagateOutput(this.outputNodes[1], this.outputVal[1], this.gateDelay)
    }
}
class D_FLIPFLOP extends Node{
    constructor(x, y){
        super(types.dflipflop, 4, 2, x, y);
        this.outputVal = [0, 0];
        this.inputNames = ['PRS', 'CLR', 'D', 'clk'];
        this.isCombinational = false;
        this.gateDelay = 10; // ms
    }
    operate(){
        let clk = this.inputVal[3]
        if (this.inputVal[0] == 1 || this.inputVal[1] == 1) { 
            if(this.inputVal[0] == 1 && this.inputVal[1] == 1) this.outputVal.fill(1);
            else if(this.inputVal[0] == 1) this.outputVal[0] = 1;
            else if(this.inputVal[1] == 1) this.outputVal[0] = 0;
        } else {
            if(clk == 1){
                this.outputVal[0] = this.inputVal[2];
                this.outputVal[1] = !this.outputVal[0];
            }
        }
        propagateOutput(this.outputNodes[0], this.outputVal[0], this.gateDelay)
        propagateOutput(this.outputNodes[1], this.outputVal[1], this.gateDelay)
    }
    show(){
        super.show(this.outputVal[0] == 1? '#922' : '#333');
        text(Number(this.outputVal[0]), this.x, this.y-15)
    }
}
class JK_FLIPFLOP extends Node{
    constructor(x, y){
        super(types.jkflipflop, 3, 2, x, y);
        this.outputVal = [0, 1];
        this.inputNames = ['J', 'K', 'clk'];
        this.isCombinational = false;
        this.gateDelay = 10; // ms
    }
    operate(){
        let clk = this.inputVal[2]    
        if(clk == 1){
            if(this.inputVal[0] == 1 && this.inputVal[1] == 1){
                this.outputVal[0] = !this.outputVal[0]
                this.outputVal[1] = !this.outputVal[1]
            } else if(this.inputVal[0] == 1 || this.inputVal[1] == 1){
                this.outputVal[0] = this.inputVal[0];
                this.outputVal[1] = !this.outputVal[0];
            }
        }
        propagateOutput(this.outputNodes[0], this.outputVal[0], this.gateDelay)
        propagateOutput(this.outputNodes[1], this.outputVal[1], this.gateDelay)
    }
    show(){
        super.show(this.outputVal[0] == 1? '#922' : '#333');
        text(Number(this.outputVal[0]), this.x, this.y-25)
    }
}
class REGISTER_4 extends Node{
    constructor(x, y){
        super(types.register4, 6, 4, x, y);
        this.inputNames = ['a0','a1','a2','a3','store','clock']
        this.outputNames = ['a0','a1','a2','a3','store','clock']
        this.outputVal = new Array(4).fill(0);
        this.isCombinational = false;
    }
    operate(){
        let currClock = this.inputVal[5];
        if(currClock == 1){
            if(this.inputVal[4] == 1){
                for(let i = 0; i < this.outputVal.length; i++){
                    this.outputVal[i] = this.inputVal[i];
                }
            }
        }
        for(let i = 0; i < this.outputNodes.length; i++){
            propagateOutput(this.outputNodes[i], this.outputVal[i], this.gateDelay)
        }
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
class DISPLAY extends Node{
    constructor(x, y){
        super(types.display, 7, 0, x, y, 100, 150);
        this.prevClock = 0;
        this.inputNames = ['a0','a1','a2','a3','a4','a5','a6']
        this.isCombinational = false;
    }
    operate(){}
    show(){
        push();
        rectMode(CENTER)
        fill('#333')
        translate(this.x, this.y)
        rect(0, 0, this.w, this.h)
        textAlign(LEFT, CENTER);
        fill(255)
        for (let i = 0; i < this.inputPos.length; i++) {
            rect(this.inputPos[i].x, this.inputPos[i].y, 12, 10);
            if(this.inputNames?.[i]){
                text(this.inputNames[i], this.inputPos[i].x+7, this.inputPos[i].y);
            }
        }
        translate(10, 0)
        stroke(255)
        strokeWeight(5)
        let ledSize = 40, gap = 8
        stroke(this.inputVal[0] == 1? 255 : 70)
        line(-ledSize/2,-ledSize-gap*2,ledSize/2,-ledSize-gap*2) // 0
        stroke(this.inputVal[1] == 1? 255 : 70)
        line(ledSize/2+gap,-gap,ledSize/2+gap,-ledSize-gap) // 1
        stroke(this.inputVal[2] == 1? 255 : 70)
        line(ledSize/2+gap,gap,ledSize/2+gap,ledSize+gap) // 2
        stroke(this.inputVal[3] == 1? 255 : 70)
        line(-ledSize/2,ledSize+gap*2,ledSize/2,ledSize+gap*2) // 3
        stroke(this.inputVal[4] == 1? 255 : 70)
        line(-ledSize/2-gap,gap,-ledSize/2-gap,ledSize+gap) // 4
        stroke(this.inputVal[5] == 1? 255 : 70)
        line(-ledSize/2-gap,-gap,-ledSize/2-gap,-ledSize-gap) // 5
        stroke(this.inputVal[6] == 1? 255 : 70)
        line(-ledSize/2,0,ledSize/2,0) // 6
        pop();
    }
}
class DISPLAY_DRIVER extends Node{
    constructor(x, y){
        super(types.displayDriver, 4, 7, x, y, 100, 150);
        this.inputNames = ['a0','a1','a2','a3']
        this.isCombinational = false;
    }
    operate(){
        let num = 0, leds;
        this.inputVal.forEach((v, i) => num += Math.pow(2, i)*v);
        if(num == 0) leds = [1,1,1,1,1,1,0];
        else if(num == 1) leds = [0,1,1,0,0,0,0];
        else if(num == 2) leds = [1,1,0,1,1,0,1];
        else if(num == 3) leds = [1,1,1,1,0,0,1];
        else if(num == 4) leds = [0,1,1,0,0,1,1];
        else if(num == 5) leds = [1,0,1,1,0,1,1];
        else if(num == 6) leds = [1,0,1,1,1,1,1];
        else if(num == 7) leds = [1,1,1,0,0,0,0];
        else if(num == 8) leds = [1,1,1,1,1,1,1];
        else if(num == 9) leds = [1,1,1,1,0,1,1];
        else leds = [0,0,0,0,0,0,0];
        for(let i = 0; i < leds.length; i++)
            propagateOutput(this.outputNodes[i], leds[i], this.gateDelay);
    }
}
class JUNCTION extends Node{
    constructor(x, y){
        super(types.junction, 1, 1, x, y)
        this.gateDelay = 0;
    }
    operate(){
        this.outputNodes.forEach(out => {
            let a = this.inputVal[0];
            propagateOutput(out, eval(operations[this.type]), this.gateDelay)
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
    constructor(name, inputs, outputs, boolfunctions, gateDelay, x, y){
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
        this.gateDelay = gateDelay
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
        return new GROUP(this.type, this.inputNames, this.outputNames, this.boolfunctions, this.gateDelay)
    }
    show(){
        super.show();
    }
}

function propagateOutput(output, val, delay){
    if (!output) return;
    setTimeout(() => {
        output.node.setInput(val, output.index);
    }, delay);
}

function isInsideRect(cx, cy, w, h, x, y, tx = 0, ty = 0){
    return !(x-tx > cx+w/2 || x-tx < cx-w/2 || y-ty > cy+h/2 || y-ty < cy-h/2);
}
