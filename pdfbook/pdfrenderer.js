let url = "https://file-examples.com/storage/fe1aa0c9d563ea1e4a1fd34/2017/10/file-sample_150kB.pdf";
let canvas;
let pdfDoc = null,
    pagenum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;
let resolution = 10;
var scaleamount = 1;
let scale = 1.9 * resolution * scaleamount / 5;
let ctx;
let canvasWidth = 230*resolution, canvasHeight = 300*resolution;


let viewport;

// render the page 

const renderPage = num => {
  pageIsRendering = true;
  pdfDoc.getPage(num).then(page => {
    viewport = page.getViewport({scale});
    // var scalex = canvasWidth / viewport.width;
    // var scaley = canvasHeight / viewport.height;
    // scale = Math.min(scalex, scaley);
    // viewport = page.getViewport({scale});
    
    const renderCtx = {
      canvasContext: ctx,
      viewport
    }
    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;
      if (pageNumIsPending != null){
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    })
  })
};

// get document
var documentLoaded = false;
// pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
//   pdfDoc = pdfDoc_;
//   for (var i = 0; i < pdfDoc.numPages; i++) {
//     var book = document.getElementById("book");
//     book.innerHTML += "<canvas class='pages'></canvas>";
//   }
//   setZindex();
//   documentLoaded = true;
// });





var forcedLoadingPage = 1;

function loadCorrectly (){
  if(forcedLoadingPage <= pdfDoc.numPages && documentLoaded) {
    canvas = document.getElementsByClassName("pages")[forcedLoadingPage-1];
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    renderPage(forcedLoadingPage);
    forcedLoadingPage++;
    pagenum++;
  }
}

// const queueRenderPage = num => {
//   if (pageIsRendering) {
//     pageNumIsPending = num;
//   } else {
//     renderPage(num);
//   }
// }



var typedarray;
var inputElement = document.getElementById('pdf');
var fetchBtn = document.getElementById('fetch');
var resolutioninput = document.getElementById('resolution');
var scaleinput = document.getElementById('scale');
var formPage = document.getElementById('formPage');
var left_arrow = document.getElementById('left_arrow');
var right_arrow = document.getElementById('right_arrow');
fetchBtn.onclick = function(event) {
  event.preventDefault();
  if (inputElement.files[0] != null){
    resolution = resolutioninput.value;
    scaleamount = scaleinput.value;
    formPage.style.display = "none";
    left_arrow.style.display = "block";
    right_arrow.style.display = "block";
    var file = inputElement.files[0];
    var fileReader = new FileReader();  
    fileReader.onload = function() {
      var typedarray = new Uint8Array(this.result);
      const loadingTask = pdfjsLib.getDocument(typedarray);
      loadingTask.promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        for (var i = 0; i < pdfDoc.numPages; i++) {
          var book = document.getElementById("book");
          book.innerHTML += "<canvas class='pages'></canvas>";
        }
        setZindex();
        documentLoaded = true;      
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
}

var nopdfbtn = document.getElementById('nopdfbtn');
nopdfbtn.onclick = function(event){
  event.preventDefault();
  resolution = resolutioninput.value;
  scaleamount = scaleinput.value;
  formPage.style.display = "none";
  left_arrow.style.display = "block";
  right_arrow.style.display = "block";
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    for (var i = 0; i < pdfDoc.numPages; i++) {
      var book = document.getElementById("book");
      book.innerHTML += "<canvas class='pages'></canvas>";
    }
    setZindex();
    documentLoaded = true;      
  });
}
