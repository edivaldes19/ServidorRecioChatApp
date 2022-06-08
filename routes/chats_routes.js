const ChatsController = require('../controllers/chats_controller')
const passport = require('passport')
module.exports = (app) => {
    app.get('/api/chats/findByIdUser/:id_user', passport.authenticate('jwt', { session: false }), ChatsController.findByUser)
    app.post('/api/chats/create', passport.authenticate('jwt', { session: false }), ChatsController.create)
}