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
    let roomId
    socket.on('queue', function() {
        if (roomId = g.findMatch(socket)) {
            let match = g.getMatch(roomId)
            match.players[0].emit('move')
            match.players[1].emit('wait')
        }
    })
    socket.on('disconnecting', function() {
        let match = g.getMatch(roomId)
        if (match) {
            match.removePlayer(socket)
            if (match.players[0])
                match.players[0].emit('empty')
        }
    })
})

server.listen(80, () => console.log('Example app listening on port 80!'))