import * as faceapi from 'face-api.js'

export const isModelLoaded = () => !!faceapi.nets.ssdMobilenetv1.params

export const loadModel = () => new Promise(async (resolve, reject) => {
  if (isModelLoaded()) return resolve()
  try {
    faceapi.nets.ssdMobilenetv1.load('/models/')
    resolve()
  } catch (err) {
    reject(err)
  }
})
