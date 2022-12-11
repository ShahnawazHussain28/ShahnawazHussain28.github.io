let nodes = [];
let createdNodes = [];
let rack = [];
let moving = null, offset = { x: 0, y: 0 };
let nearest = null;
let optionNode = null;
let lining = null;
let bg;
let localStorageTypesKey = 'circuitsim_types', localStorageOperationsKey = 'circuitsim_operations', localStorageNodeKey = 'circuitsim_node';


window.addEventListener('load', () => {
    restoreGroups();
})
function restoreGroups(){
    let localtypes = localStorage.getItem(localStorageTypesKey);
    let localoperations = localStorage.getItem(localStorageOperationsKey);
    let localNodeData = localStorage.getItem(localStorageNodeKey);
    if(localNodeData) nodeData = JSON.parse(localNodeData);
    if(localtypes) {
        localtypes = JSON.parse(localtypes)
        let localKeys = Object.keys(localtypes)
        let keys = Object.keys(types)
        let extraKeys = localKeys.filter(x => !keys.includes(x));
        types = localtypes;
        extraKeys.forEach(key => {
            let groupNode = new GROUP(key, nodeData[types[key]].inputNames, nodeData[types[key]].outputNames, operations[types[key]]);
            createdNodes.push(groupNode);
            let sidebar = document.getElementsByClassName('sidebar')[0];
            let btn = createButton(groupNode.type);
            btn.addClass('nodebtn');
            btn.elt.setAttribute("onclick", `placeGroup(${createdNodes.length - 1})`)
            btn.parent(sidebar);
        })
    }
    if(localoperations) operations = JSON.parse(localoperations);
}

function setup() {
    if (window.location.search?.substring(1) == 'full') {
        let cnvcont = document.getElementsByClassName("cnvcont")[0]
        cnvcont.style.width = "300%";
        cnvcont.style.height = "300%";
    }
    createCanvas(1, 1).parent(select('.cnvcont'));
    let cnvcont = select('.cnvcont')
    document.getElementsByTagName("canvas")[0].addEventListener('contextmenu', (e) => e.preventDefault())
    resizeCanvas(cnvcont.width, cnvcont.height);
    bg = createBG();
    image(bg, 0, 0);
    resizeWindow();
}

function draw() {
    setNearest();
}

function keyPressed() {
    if (key == 'Delete') {
        if (!isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) return;
        optionNode = nearest;
        deleteNode(optionNode)
    } else if (keyIsDown(CONTROL) && (key == 'a' || key == 'A')) {
        if (!isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) return;
        optionNode = nearest;
        renameNode(optionNode);
    } else if (keyIsDown(CONTROL) && (key == 'b' || key == 'B')) {
        if (!isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) return;
        optionNode = nearest;
        breakOutputConnection(optionNode);
    }
}
let mousePressedTimeout = true;
function mousePressed() {
    if (!mousePressedTimeout) return;
    if (!nearest) return;
    if (isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) {
        nearest.onclick?.();
        moving = nearest;
        offset = { x: nearest.x - mouseX, y: nearest.y - mouseY };
    }
    for (let i = 0; i < nearest.inputPos.length; i++) {
        let p = nearest.inputPos[i];
        if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, mouseX, mouseY)) {
            lining = { node: nearest, index: i, type: 'input', x: nearest.x + p.x, y: nearest.y + p.y };
            moving = null;
        }
    }
    for (let i = 0; i < nearest.outputPos.length; i++) {
        let p = nearest.outputPos[i];
        if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, mouseX, mouseY)) {
            if (nearest.outputNodes[i] == null) {
                lining = { node: nearest, index: i, type: 'output', x: nearest.x + p.x, y: nearest.y + p.y };
                moving = null;
            }
        }
    }
}
let lineEnd;
function mouseDragged() {
    image(bg, 0, 0);
    lineEnd = { x: mouseX, y: mouseY }
    if (moving) {
        if (rack.includes(moving)) rack.splice(rack.indexOf(moving), 1)
        moving.move(mouseX + offset.x, mouseY + offset.y);
    } else if (lining) {
        for (let i = 0; i < nearest.inputPos.length; i++) {
            let p = nearest.inputPos[i];
            if (dist(mouseX, mouseY, nearest.x + p.x, nearest.y + p.y) < 15) {
                lineEnd.x = nearest.x + p.x;
                lineEnd.y = nearest.y + p.y;
            }
        }
        line(lining.x, lining.y, lineEnd.x, lineEnd.y);
    }
}
function mouseReleased() {
    moving = null;
    if (lining?.type == 'output') {
        for (let i = 0; i < nearest.inputPos.length; i++) {
            let p = nearest.inputPos[i];
            if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, lineEnd.x, lineEnd.y)) {
                if (lining.node.type == types.junction) {
                    lining.node.outputNodes.push({ node: nearest, index: i })
                } else {
                    lining.node.outputNodes[lining.index] = { node: nearest, index: i }
                }
            }
        }
    } else if (lining?.type == 'input') {
        for (let i = 0; i < nearest.outputPos.length; i++) {
            let p = nearest.outputPos[i];
            if (isInsideRect(nearest.x + p.x, nearest.y + p.y, 12, 12, lineEnd.x, lineEnd.y)) {
                if (nearest.type == types.junction) {
                    nearest.outputNodes.push({ node: lining.node, index: lining.index })
                } else {
                    nearest.outputNodes[i] = { node: lining.node, index: lining.index }
                }
            }
        }
    }
    lining = null;
    image(bg, 0, 0);
}
let setintervalvar;

function touchStarted() {
    setNearest();
    mousePressed();
    setintervalvar = setTimeout(() => {
        touchHold();
    }, 500);
}
function touchMoved() {
    mouseDragged();
    clearInterval(setintervalvar)
}
function touchEnded() {
    mouseReleased();
    clearTimeout(setintervalvar);
    mousePressedTimeout = false;
    setTimeout(() => {
        mousePressedTimeout = true;
    }, 100);
}
function touchHold() {
    if (isInsideRect(nearest.x, nearest.y, nearest.w, nearest.h, mouseX, mouseY)) {
        optionNode = nearest;
        showOptions();
    }
}

function renameNode(node) {
    if (!node) {
        hideOptions();
        return;
    }
    if (node.type == types.input || node.type == types.output) {
        let name = prompt("Enter the new Name (No spaces, only underscore): ");
        if (!name) { alert("Please enter a name"); return; }
        if (!name.match(/^\w+$/)) { alert("Only letters numbers and underscores, must not start with a number"); return; }
        node.name = name;
    }
    image(bg, 0, 0);
    hideOptions();
    optionNode = null;
}
function deleteNode(node) {
    if (!node) {
        hideOptions();
        return;
    }
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].outputNodes.length; j++) {
            if (nodes[i].outputNodes[j]?.node == node) {
                nodes[i].outputNodes[j] = null;
            }
        }
    }
    nodes.splice(nodes.indexOf(node), 1);
    image(bg, 0, 0);
    optionNode = null;
    hideOptions();
}

function breakOutputConnection(node) {
    if (!node) {
        hideOptions();
        return;
    }
    for(let i = 0; i < node.outputNodes.length; i++){
        node.outputNodes[i]?.node.setInput(0, node.outputNodes[i].index);
    }
    node.outputNodes.fill(null);
    image(bg, 0, 0);
    optionNode = null;
    hideOptions();
}

function hideOptions() {
    document.getElementById("actionpanel").style.display = 'none';
}
function showOptions() {
    document.getElementById("actionpanel").style.display = 'flex';
}

function createGroup() {
    try {
        if (!nodes) return;
        let name = prompt("Enter the Name of this group");
        if (!name) {
            alert("Enter a valid name");
            return;
        }
        let inputs = nodes.filter(node => (node.type == types.input) || (node.type == types.pulse));
        let gNodes = [];
        let _ids = [];
        for (let i = 0; i < inputs.length; i++) {
            gNodes.push(...DFS(inputs[i], _ids))
        }
        if(gNodes.filter(n => n.isCombinational == false).length > 0) {
            alert("Cannot group Sequential Circuits. Sorry :(")
            return;
        }
        inputs = gNodes.filter(n => n.type == types.input)
        let inpNames = inputs.map(a => a.name);
        let outputs = gNodes.filter(n => n.type == types.output)
        let outNames = outputs.map(a => a.name);
        let duplicateInps = inpNames.filter((inp, i) => inpNames.indexOf(inp) !== i);
        let duplicateOutps = outNames.filter((out, i) => outNames.indexOf(out) !== i);
        if (duplicateInps.length > 0 || duplicateOutps.length > 0) {
            alert("All inputs and outputs must be named unique, Hover and press CTRL+A to rename");
            return;
        }
        let boolFunc = getBooleanFunction(outputs);
        let groupNode = new GROUP(name, inpNames.sort(), outNames, boolFunc);
        createdNodes.push(groupNode);
        let sidebar = document.getElementsByClassName('sidebar')[0];
        let btn = createButton(groupNode.type);
        btn.addClass('nodebtn')
        btn.elt.setAttribute("onclick", `placeGroup(${createdNodes.length - 1})`)
        btn.parent(sidebar);
        nodes = [];
        placeGroup(createdNodes.length - 1)
    } catch (error) {
        console.error(error)
        alert("Could Not Create Node Group sorry :(")
    }
}
function DFS(node, _ids = []) {
    let _nodes = [];
    if (!node) return _nodes;
    if (node.type == types.output) return _nodes;
    if (_ids.includes(node.id)) return _nodes;
    if (node.type == types.input) {
        node.name = node.name || node.type;
    } else if(node.type == types.pulse) {
        node.name = 'clk';
    }
    _ids.push(node.id)
    _nodes.push(node)
    for (let i = 0; i < node.outputNodes.length; i++) {
        if (!node.outputNodes[i]) continue;
        if (node.outputNodes[i]?.node.type == types.output) {
            node.outputNodes[i].node.name = node.outputNodes[i].node.name || node.outputNodes[i].node.type;
            _ids.push(node.outputNodes[i].node.id);
            _nodes.push(node.outputNodes[i].node);
        } else
            _nodes.push(...DFS(node.outputNodes[i]?.node, _ids));
        if (!node.outputNodes[i].node.inputNodes) node.outputNodes[i].node.inputNodes = [];
        let check = node.outputNodes[i].node.inputNodes.filter(n => ((n.node.id == node.id) && (n.index == i)))
        if (check.length == 0)
            node.outputNodes[i].node.inputNodes.push({ node, index: i });
    }
    return _nodes;
}
function getBooleanFunction(outputs) {
    let outputArr = [];
    for (let i = 0; i < outputs.length; i++) {
        outputArr.push(revDFS(outputs[i], 0));
    }
    return outputArr;
}
function revDFS(node, idx) {
    if (!node) return '';
    if (node.type == types.input || node.type == types.pulse) {
        return node.name;
    }
    if (!node.inputNodes) return '';
    let variables = {}
    let varASCII = 97;
    for (let i = 0; i < node.inputNodes.length; i++) {
        variables[char(varASCII++)] = {
            node: node.inputNodes[i]?.node,
            index: node.inputNodes[i]?.index
        }
    }
    let out = operations[node.type];
    if (typeof out != 'string') {
        out = out[idx];
    }
    out = listFromString(out);
    for (let i = 0; i < out.length; i++) {
        if (out[i].match(/^\w$/g)) {
            out[i] = revDFS(variables[out[i]].node, variables[out[i]].index);
        }
    }
    out = out.join('')
    return out;
}

function placeNode(node) {
    let x = 50, y = 100;
    if (rack.length > 0) {
        x = rack[rack.length - 1].x + rack[rack.length - 1].w / 2 + node.w / 2 + 20;
        y = rack[rack.length - 1].y;
        if (x + node.w / 2 + 10 > width) {
            x = 50;
            y += 50;
        }
    }
    node.x = x;
    node.y = y;
    rack.push(node);
    nodes.push(node)
}

function listFromString(str) {
    if (str.length == 1) return [str];
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i].match(/\w/) && str[i - 1].match(/\W/))
            str = str.substring(0, i) + '.' + str.substring(i, i + 1) + '.' + str.substring(i + 1)
    }
    return str.split('.');
}

window.addEventListener('resize', resizeWindow)

function resizeWindow() {
    if (windowWidth < windowHeight) {
        select('.sidebar').elt.className = 'sidebar hr';
    } else {
        select('.sidebar').elt.className = 'sidebar vr';
    }
    let cnvcont = select('.cnvcont')
    resizeCanvas(cnvcont.width, cnvcont.height - 10);
    image(bg, 0, 0, width, height);
}


function setNearest() {
    let minDist = 1000000;
    for (let i = 0; i < nodes.length; i++) {
        let distance = dist(mouseX, mouseY, nodes[i].x, nodes[i].y);
        if (distance < minDist) {
            minDist = distance;
            nearest = nodes[i];
        }
        nodes[i].show();
        nodes[i].operate()
    }
}
function placeGroup(i) {
    placeNode(createdNodes[i].clone());
}

function createBG(){
    let bg = createGraphics(width, height);
    let size = 100;
    bg.stroke(0, 50)
    bg.background('#555')
    for (let j = 0; j < height; j += size) bg.line(0, j, width, j);
    for (let i = 0; i < width; i += size) bg.line(i, 0, i, height);
    bg.fill(0, 60);
    bg.noStroke()
    bg.textAlign(CENTER, CENTER)
    bg.textSize(50)
    bg.translate(windowWidth / 2, windowHeight / 2)
    bg.rotate(-PI / 16)
    bg.text("by Shahnawaz", 0, 0);
    return bg;
}

function toggleFullscreen() {
    if (document.fullscreenElement)
        document.exitFullscreen()
    else
        document.body.requestFullscreen()
}

function expandCanvas() {
    let cnvcont = select('.cnvcont');
    if (width > windowWidth) {
        let yes = confirm("All progress will be lost, Smaller canvas will run faster on mobile devices. Want to contract?")
        if (yes) window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/'))
    } else {
        let yes = confirm("All progress will be lost, On mobile devices expanding window can slow down this simulator. Want to expand?")
        if (yes) window.location.href = window.location.href + '/?full';
    }
}
function clearAllData(){
    if(confirm("All Data will be lost... Continue?")){
        if(confirm("All Group Nodes will be deleted for ever! Want to delete????")){
            localStorage.clear();
            window.location.reload()
        }
    }
}

let cnvcontcont = document.getElementsByClassName("cnvcontcont")[0]
cnvcontcont.addEventListener('scroll', handleScroll, false);

var handleScroll = function () {
    cnvcontcont.scrollTo(0, 0);  // required when scroll bar is drgged
};
var handleEvent = function (e) {
    if (moving)
        e.preventDefault();      // disables scrolling by mouse wheel and touch move
};
cnvcontcont.addEventListener('scroll', handleEvent, false);
cnvcontcont.addEventListener('touchmove', handleEvent, false);

function createHalfAdder() {
    let inp1 = new INPUT();
    inp1.name = 'b'
    let inp2 = new INPUT();
    inp2.name = 'a'
    let out1 = new OUTPUT();
    out1.name = 's'
    let out2 = new OUTPUT();
    out2.name = 'c'
    let and = new AND();
    let xor = new XOR();
    let junc1 = new JUNCTION();
    let junc2 = new JUNCTION();
    inp1.outputNodes = [{ node: junc1, index: 0 }]
    inp2.outputNodes = [{ node: junc2, index: 0 }]
    junc1.outputNodes = [{ node: xor, index: 0 }, { node: and, index: 0 }]
    junc2.outputNodes = [{ node: xor, index: 1 }, { node: and, index: 1 }]
    xor.outputNodes = [{ node: out1, index: 0 }]
    and.outputNodes = [{ node: out2, index: 0 }]
    placeNode(inp1)
    placeNode(inp2)
    placeNode(junc1)
    placeNode(junc2)
    placeNode(xor)
    placeNode(and)
    placeNode(out1)
    placeNode(out2)
    createGroup()
}