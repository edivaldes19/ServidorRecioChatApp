const Chat = require('../models/chat')
module.exports = {
    async create(req, res, next) {
        try {
            const chat = req.body
            const existChat = await Chat.findByUser1AndUser2(chat.id_user1, chat.id_user2)
            if (existChat) {
                console.log('Chat actualizado.')
                await Chat.update(chat)
                return res.status(201).json({
                    message: 'Chat creado exitosamente.',
                    success: true,
                    data: existChat.id
                })
            } else {
                console.log('Chat creado.')
                const data = await Chat.create(chat)
                return res.status(201).json({
                    message: 'Chat creado exitosamente.',
                    success: true,
                    data: data.id
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                message: 'Error al crear el chat.',
                success: false,
                error: error
            })
        }
    },
    async findByUser(req, res, next) {
        try {
            const id_user = req.params.id_user
            const data = await Chat.findByIdUser(id_user)
            return res.status(201).json(data)
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                message: 'Error al mostrar los chats.',
                success: false,
                error: error
            })
        }
    }
}