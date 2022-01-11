var a11, a12, a13, a21, a22, a23, a31, a32, a33;
var b11, b12, b13, b21, b22, b23, b31, b32, b33;

var operation = "multiply";

var A = [[a11, a12, a13],
         [a21, a22, a23], 
         [a31, a32, a33]];

var B = [[b11, b12, b13], 
         [b21, b22, b23], 
         [b31, b32, b33]];

var dim = 3;



function matAdd (a, b) {
    var res = [];
    if ((a.length != b.length) || (a[0].length != b[0].length)) return null;
    for (var j = 0; j < a.length; j++) {
        res[j] = [];
        for (var i = 0; i < a[0].length; i++) {
            res[j][i] = parseInt(a[j][i]) + parseInt(b[j][i]);
        }
    }
    return res;
}

function matSub (a, b) {
    var res = [];
    if ((a.length != b.length) || (a[0].length != b[0].length)) return null;
    for (var j = 0; j < a.length; j++) {
        res[j] = [];
        for (var i = 0; i < a[0].length; i++) {
            res[j][i] = parseInt(a[j][i]) - parseInt(b[j][i]);
        }
    }
    return res;
}

function matMul (a, b) {
    var res = [];
    for (var j = 0; j < dim; j++) {
        res[j] = [];
        for (var i = 0; i < dim; i++) {
            var val1 = a[j][0] * b[0][i];
            var val2 = a[j][1] * b[1][i];
            var val3 = a[j][2] * b[2][i];
            var val = val1 + val2 + val3;

            res[j][i] = val;
        }
    }
    return res;
}

function inverse (a) {
    var det = determinant(a);
    var adjA = [];
    for (var j = 0; j < dim; j++) {
        adjA[j] = [];
        for (var i = 0; i < dim; i++) {
            var x = determinant(get2Matrix(a, j, i));
            if (((i+1)+(j+1)) % 2 != 0) {
                x *= -1;
            }
            adjA[j][i] = x;
        }
    }
    adjA = transpose(adjA);
    return [det, adjA];
}


function determinant (a) {
    var det;
    if (a.length == 3) {
        det = a[0][0] * determinant(get2Matrix(a, 0, 0)) - a[0][1] * determinant(get2Matrix(a, 0, 1)) + a[0][2] * determinant(get2Matrix(a, 0, 2));
    } else if (a.length == 2) {
        det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
    }
    return det;
}

function transpose (a) {
    var res = [];
    for (var j = 0; j < a.length; j++) {
        res[j] = [];
        for (var i = 0; i < a[0].length; i++) {
            res[j][i] = a[i][j];
        }
    }
    return res;
}


function get2Matrix (a, y, x) {
    var mat2Array = [];
    for (var j = 0; j < dim; j++) {
        for (var i = 0; i < dim; i++) {
            if (i != x && j != y) {
                mat2Array.push(a[j][i]);
            }           
        }
    }
    var mat2 = [[mat2Array[0], mat2Array[1]],
                [mat2Array[2], mat2Array[3]]];
    return mat2;
}



















































function getMatrix () {
    var isSingle = document.getElementById("matrix2").style.display == "none"? true : false;
    for (let j = 0; j < dim; j++) {
        for (let i = 0; i < dim; i++) {
            A[j][i] = document.getElementById("a"+ (j+1).toString() + (i+1).toString()).value;
            if (!isSingle)
            B[j][i] = document.getElementById("b"+ (j+1).toString() + (i+1).toString()).value;
        }   
    }
}


function calculate () {
    getMatrix();
    var displayText;
    if (operation == "multiply") {
        var result = matMul(A, B);
        displayText = "\\[ \\begin{bmatrix}"+
                            A[0][0].toString()+"&"+A[0][1].toString()+"&"+A[0][2].toString()+"\\\\"+
                            A[1][0].toString()+"&"+A[1][1].toString()+"&"+A[1][2].toString()+"\\\\"+
                            A[2][0].toString()+"&"+A[2][1].toString()+"&"+A[2][2].toString()+
                            "\\end{bmatrix}"+
                            "\\times"+
                            "\\begin{bmatrix}"+
                            B[0][0].toString()+"&"+B[0][1].toString()+"&"+B[0][2].toString()+"\\\\"+
                            B[1][0].toString()+"&"+B[1][1].toString()+"&"+B[1][2].toString()+"\\\\"+
                            B[2][0].toString()+"&"+B[2][1].toString()+"&"+B[2][2].toString()+
                            "\\end{bmatrix}"+
                            "="+
                            "\\begin{bmatrix}"+
                            result[0][0].toString()+"&"+result[0][1].toString()+"&"+result[0][2].toString()+"\\\\"+
                            result[1][0].toString()+"&"+result[1][1].toString()+"&"+result[1][2].toString()+"\\\\"+
                            result[2][0].toString()+"&"+result[2][1].toString()+"&"+result[2][2].toString()+
                            "\\end{bmatrix} \\]";
    }
    else if (operation == "inverse") {
        var result = inverse(A);
        var det = result[0];
        var adjA = result[1];
        displayText = "\\[ \\begin{bmatrix}"+
                            A[0][0].toString()+"&"+A[0][1].toString()+"&"+A[0][2].toString()+"\\\\"+
                            A[1][0].toString()+"&"+A[1][1].toString()+"&"+A[1][2].toString()+"\\\\"+
                            A[2][0].toString()+"&"+A[2][1].toString()+"&"+A[2][2].toString()+
                            "\\end{bmatrix} ^{-1}"+
                            "=";
        if (det != 0) {
            displayText += "\\frac{1}{"+det+"} \\begin{bmatrix}"+
                                adjA[0][0]+"&"+adjA[0][1]+"&"+adjA[0][2]+"\\\\"+
                                adjA[1][0]+"&"+adjA[1][1]+"&"+adjA[1][2]+"\\\\"+
                                adjA[2][0]+"&"+adjA[2][1]+"&"+adjA[2][2]+
                                "\\end{bmatrix} \\]";
        } else {
            displayText += "\\textrm{Not Invertible} \\]";
        }
    }
    else if (operation == "addition") {
        var result = matAdd(A, B);
        displayText = "\\[ \\begin{bmatrix}"+
                        A[0][0].toString()+"&"+A[0][1].toString()+"&"+A[0][2].toString()+"\\\\"+
                        A[1][0].toString()+"&"+A[1][1].toString()+"&"+A[1][2].toString()+"\\\\"+
                        A[2][0].toString()+"&"+A[2][1].toString()+"&"+A[2][2].toString()+
                        "\\end{bmatrix}"+
                        "+"+
                        "\\begin{bmatrix}"+
                        B[0][0].toString()+"&"+B[0][1].toString()+"&"+B[0][2].toString()+"\\\\"+
                        B[1][0].toString()+"&"+B[1][1].toString()+"&"+B[1][2].toString()+"\\\\"+
                        B[2][0].toString()+"&"+B[2][1].toString()+"&"+B[2][2].toString()+
                        "\\end{bmatrix}"+
                        "="+
                        "\\begin{bmatrix}"+
                        result[0][0].toString()+"&"+result[0][1].toString()+"&"+result[0][2].toString()+"\\\\"+
                        result[1][0].toString()+"&"+result[1][1].toString()+"&"+result[1][2].toString()+"\\\\"+
                        result[2][0].toString()+"&"+result[2][1].toString()+"&"+result[2][2].toString()+
                        "\\end{bmatrix} \\]";
    }
    else if (operation == "subtraction") {
        var result = matSub(A, B);
        displayText = "\\[ \\begin{bmatrix}"+
                        A[0][0].toString()+"&"+A[0][1].toString()+"&"+A[0][2].toString()+"\\\\"+
                        A[1][0].toString()+"&"+A[1][1].toString()+"&"+A[1][2].toString()+"\\\\"+
                        A[2][0].toString()+"&"+A[2][1].toString()+"&"+A[2][2].toString()+
                        "\\end{bmatrix}"+
                        "-"+
                        "\\begin{bmatrix}"+
                        B[0][0].toString()+"&"+B[0][1].toString()+"&"+B[0][2].toString()+"\\\\"+
                        B[1][0].toString()+"&"+B[1][1].toString()+"&"+B[1][2].toString()+"\\\\"+
                        B[2][0].toString()+"&"+B[2][1].toString()+"&"+B[2][2].toString()+
                        "\\end{bmatrix}"+
                        "="+
                        "\\begin{bmatrix}"+
                        result[0][0].toString()+"&"+result[0][1].toString()+"&"+result[0][2].toString()+"\\\\"+
                        result[1][0].toString()+"&"+result[1][1].toString()+"&"+result[1][2].toString()+"\\\\"+
                        result[2][0].toString()+"&"+result[2][1].toString()+"&"+result[2][2].toString()+
                        "\\end{bmatrix} \\]";
    }
    document.getElementById("displayMatrix").innerHTML = displayText;
    MathJax.typeset();
}


function changeOperation (option) {
    if (option.value == "Inverse") {
        operation = "inverse";
        document.getElementById("matrix2").style.display = 'none';
        document.getElementById("symbol").style.display = 'none';
        document.getElementById("headerText").innerHTML = "Inverse Matrix";
        document.getElementById("calculate").innerHTML = "INVERSE";
    } else if (option.value == "Multiply") {
        operation = "multiply";
        document.getElementById("matrix2").style.display = 'inline-block';
        document.getElementById("symbol").innerHTML = '&#10006';
        document.getElementById("symbol").style.display = 'inline';
        document.getElementById("headerText").innerHTML = "Matrix Multiplication";
        document.getElementById("calculate").innerHTML = "MULTIPLY";
    } else if (option.value == "Addition") {
        operation = "addition";
        document.getElementById("matrix2").style.display = 'inline-block';
        document.getElementById("symbol").innerHTML = '+';
        document.getElementById("symbol").style.display = 'inline';
        document.getElementById("headerText").innerHTML = "Matrix Addition";
        document.getElementById("calculate").innerHTML = "ADD";
    } else if (option.value == "Subtraction") {
        operation = "subtraction";
        document.getElementById("matrix2").style.display = 'inline-block';
        document.getElementById("symbol").innerHTML = '-';
        document.getElementById("symbol").style.display = 'inline';
        document.getElementById("headerText").innerHTML = "Matrix Subtraction";
        document.getElementById("calculate").innerHTML = "SUBTRACT";
    }
}