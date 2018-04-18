/* ExpressJS */
const express = require('express')
const app = express()

// Express middleware
app.use('/static', express.static('assets'))
app.set('view engine', 'ejs')

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        pageTitle: 'Online TicTacToe'
    })
})
app.get('/play', (req, res) => {
    res.render('game', {
        pageTitle: 'Play @ Online TicTacToe',
    })
})

// Servers
const server = require('http').Server(app)
const io = require('socket.io')(server)

// Game manager
let g = require('./game')

io.on('connection', function(socket) {
    socket.on('queue', function() {
        let roomId
        if (roomId = g.findMatch(socket))
            g.getMatch(roomId).players.forEach( p => p.emit('test', roomId) )
    })
    socket.on('start', function(roomId) {
        // add player to room
        // if player is alone
        //  socket.emit('empty')
        // else
        //  start game
    })
})

server.listen(80, () => console.log('Example app listening on port 80!'))