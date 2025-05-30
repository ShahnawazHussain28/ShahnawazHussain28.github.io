let canvas = null
let selectedImage = null
const DEPTH = 1
let output = ""

document.querySelector("#encode").addEventListener("click", encodeImage)
document.querySelector("#decode").addEventListener("click", decodeImage)

function handleFile(file) {
  selectedImage = loadImage(file.data, (img) => {
    const aspect = img.width / img.height
    const maxWidth = document.querySelector("#canvas-holder").offsetWidth
    const newWidth = img.width == maxWidth ? img.width : maxWidth
    const newHeight = img.width == maxWidth ? img.height : newWidth / aspect
    const bytes = Math.floor((img.width * img.height * (DEPTH * 3)) / 8)
    const input = document.querySelector("#messageInput")
    input.setAttribute("maxlength", bytes)
    input.setAttribute(
      "placeholder",
      `Enter your secret message here (max ${bytes} characters)...`
    )
    resizeCanvas(newWidth, newHeight)
    select("#imageUpload").hide()
    image(img, 0, 0, newWidth, newHeight)
  })
}

function setup() {
  canvas = createCanvas(200, 200)
  canvas.parent("canvas-holder")
  const inp = createFileInput(handleFile)
  inp.parent("fileInputHolder")
  inp.id("dropzone-file")
  inp.hide()
  inp.attribute("accept", "image/*")
  select("#downloadBtn").mouseClicked(() => {
    if (!selectedImage) return
    selectedImage.save("steganography.png")
  })
}

function encodeImage() {
  if (!selectedImage) return
  if (!select("#messageInput").value()) return

  const message = select("#messageInput").value()
  let messageBits = message
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("")
  const prefixLen = message.length.toString(2).padStart(24, "0")
  messageBits = prefixLen + messageBits

  let index = 0
  selectedImage.loadPixels()

  for (let j = 0; j < selectedImage.height; j++) {
    for (let i = 0; i < selectedImage.width; i++) {
      if (index >= messageBits.length) break
      const pixel = selectedImage.get(i, j)
      const r = pixel[0]
      const g = pixel[1]
      const b = pixel[2]
      const a = pixel[3]
      if (a === 0) {
        index += 3
        continue
      }
      const binR = r.toString(2)
      const binG = g.toString(2)
      const binB = b.toString(2)
      const newR =
        binR.slice(0, binR.length - DEPTH) + messageBits.charAt(index)
      const newG =
        binG.slice(0, binG.length - DEPTH) + messageBits.charAt(index + 1)
      const newB =
        binB.slice(0, binB.length - DEPTH) + messageBits.charAt(index + 2)
      selectedImage.set(i, j, [
        parseInt(newR, 2),
        parseInt(newG, 2),
        parseInt(newB, 2),
        a,
      ])
      index += 3
    }
  }

  selectedImage.updatePixels()
  image(selectedImage, 0, 0)

  select("#downloadBtn").show()
  select("#encode").hide()
}

function decodeImage() {
  if (!selectedImage) return
  let bitString = ""

  selectedImage.loadPixels()

  let lengthBits = ""
  for (let i = 0; i < 8; i++) {
    const pixel = selectedImage.get(i, 0)
    const binR = pixel[0].toString(2)
    const binG = pixel[1].toString(2)
    const binB = pixel[2].toString(2)
    lengthBits += binR[binR.length - DEPTH]
    lengthBits += binG[binG.length - DEPTH]
    lengthBits += binB[binB.length - DEPTH]
  }
  const len = parseInt(lengthBits, 2)

  for (let j = 0; j < selectedImage.height; j++) {
    for (let i = 8; i < selectedImage.width; i++) {
      if (bitString.length / 8 >= len) break
      const pixel = selectedImage.get(i, j)
      if (pixel[3] === 0) continue

      const binR = pixel[0].toString(2)
      bitString += binR[binR.length - DEPTH]

      const binG = pixel[1].toString(2)
      bitString += binG[binG.length - DEPTH]

      const binB = pixel[2].toString(2)
      bitString += binB[binB.length - DEPTH]
    }
  }

  const chars = []
  for (let i = 0; i < bitString.length; i += 8) {
    const byte = bitString.slice(i, i + 8)
    const char = String.fromCharCode(parseInt(byte, 2))
    chars.push(char)
  }
  select("#extractedMessageOutput").show()
  select("#extractedMessageOutput").html(chars.join(""))
  bitString = ""
}
