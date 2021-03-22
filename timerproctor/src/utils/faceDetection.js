import * as faceapi from 'face-api.js'

export const isModelLoaded = faceapi.nets.ssdMobilenetv1.params

export const loadModel = () => new Promise(async (resolve, reject) => {
  if (isModelLoaded) return resolve()
  try {
    await faceapi.nets.ssdMobilenetv1.load('/models/')
    resolve()
  } catch (err) {
    reject(err)
  }
})

export const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.425 })

export const detectSingleFace = (input) => faceapi.detectSingleFace(input, options)

export const detectAllFaces = (input) => faceapi.detectAllFaces(input, options)

export const getInputCanvas = (imageSrc) => new Promise((resolve) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.onload = () => { 
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)
    resolve(canvas)
  }
  image.src = imageSrc
})
