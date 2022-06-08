const Message = require('../models/message')
const storage = require('../utils/cloud_storage')
const videoStorage = require('../utils/cloud_storage_video')
module.exports = {
    async create(req, res, next) {
        try {
            const message = req.body
            const data = await Message.create(message)
            return res.status(201).json({
                message: 'Mensaje creado exitosamente.',
                success: true,
                data: data.id
            })
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                message: 'Error al crear el mensaje.',
                success: false,
                error: error
            })
        }
    },
    async findByChat(req, res, next) {
        try {
            const id_chat = req.params.id_chat
            const data = await Message.findByChat(id_chat)
            return res.status(201).json(data)
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                message: 'Error al obtener los mensajes.',
                success: false,
                error: error
            })
        }
    },
    async createWithImage(req, res, next) {
        try {
            const message = JSON.parse(req.body.message)
            console.log(`Datos enviados del usuario: ${message}`)
            const files = req.files
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}` // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage)
                if (url != undefined && url != null) {
                    message.url = url
                }
            }
            const data = await Message.create(message)
            return res.status(201).json({
                success: true,
                message: 'Mensaje creado exitosamente.',
                data: { 'id': data.id, 'url': message.url }
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario.',
                error: error
            })
        }
    },
    async createWithVideo(req, res, next) {
        try {
            const message = JSON.parse(req.body.message)
            if (req.file) {
                const path = `video_${Date.now()}` // NOMBRE DEL ARCHIVO
                const url = await videoStorage(req.file, path)
                if (url != undefined && url != null) {
                    message.url = url
                }
                const data = await Message.create(message)
                return res.status(201).json({
                    success: true,
                    message: 'Mensaje creado exitosamente.',
                    data: data.id
                })
            } else {
                return res.status(501).json({
                    success: false,
                    message: 'Error al guardar el video.'
                })
            }
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al enviar el mensaje de video.',
                error: error
            })
        }
    },
    async updateToSeen(req, res, next) {
        try {
            const id = req.body.id
            await Message.updateToSeen(id)
            return res.status(201).json({
                message: 'Mensaje actualizado a visto exitosamente.',
                success: true
            })
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                message: 'Error al actualizar el mensaje a visto.',
                success: false,
                error: error
            })
        }
    }
}