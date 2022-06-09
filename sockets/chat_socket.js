const User = require('../models/user')
module.exports = (io) => {
    const chatNSP = io.of('/chat')
    chatNSP.on('connection', function (socket) {
        console.log('USER CONNECTED TO SOCKET IO', socket.id)
        socket.on('message', function (data) {
            console.log('NEW MESSAGE', data)
            chatNSP.emit(`message/${data.id_chat}`, data)
            chatNSP.emit(`message/${data.id_user}`, data)
        })
        socket.on('writing', function (data) {
            console.log('WRITING', data)
            chatNSP.emit(`writing/${data.id_chat}/${data.id_user}`, data)
        })
        socket.on('seen', function (data) {
            console.log('VIEWED', data)
            chatNSP.emit(`seen/${data.id_chat}`, data)
        })
        socket.on('online', async function (data) {
            chatNSP.emit(`online/${data.id_user}`, { id_socket: socket.id })
            await User.updateOnlineByUser(data.id_user, true)
            await User.updateIdSocket(data.id_user, socket.id)
            console.log('USER CONNECTED TO CHAT...', socket.id)
        })
        socket.on('disconnect', async function (data) {
            console.log('DISCONNECTED', socket.id)
            chatNSP.emit(`offline/${socket.id}`, { id_socket: socket.id })
            await User.updateOnlineBySocket(socket.id, false)
        })
    })
}