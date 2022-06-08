const { Storage } = require('@google-cloud/storage')
const { format } = require('util')
const env = require('../config/env')
const url = require('url')
const { v4: uuidv4 } = require('uuid')
const uuid = uuidv4()
const storage = new Storage({
    projectId: 'reciochat',
    keyFilename: './serviceAccountKey.json'
})
const bucket = storage.bucket('gs://reciochat.appspot.com')
module.exports = (file, pathImage, deletePathImage) => {
    return new Promise((resolve, reject) => {
        console.log('delete path', deletePathImage)
        if (deletePathImage) {
            if (deletePathImage != null || deletePathImage != undefined) {
                const parseDeletePathImage = url.parse(deletePathImage)
                var ulrDelete = parseDeletePathImage.pathname.slice(23)
                const fileDelete = bucket.file(`${ulrDelete}`)
                fileDelete.delete().then((imageDelete) => {
                    console.log('Imagen eliminada exitosamente.')
                }).catch(err => {
                    console.log('Error al eliminar la imagen.', err)
                })
            }
        }
        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {
                let fileUpload = bucket.file(`${pathImage}`)
                let stream = fileUpload.createWriteStream()
                const blobStream = stream.pipe(fileUpload.createWriteStream({
                    metadata: { contentType: 'image/png', metadata: { firebaseStorageDownloadTokens: uuid, } },
                    resumable: false
                }))
                blobStream.on('error', (error) => {
                    console.log('Error al subir archivo a Firebase Storage.', error)
                    reject('Something is wrong! Unable to upload at the moment.')
                })
                blobStream.on('finish', () => {
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`)
                    console.log('CLOUD STORAGE URL', url)
                    resolve(url)
                })
                blobStream.end(file.buffer)
            }
        }
    })
}