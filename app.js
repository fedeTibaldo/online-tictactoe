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
    function findMatch() {
        if (roomId = g.findMatch(socket))
            g.getMatch(roomId).players.forEach( p => p.emit('match', roomId) )
    }
    socket.on('queue', function() {
        findMatch()
    })
    socket.on('start', function(previousRoomId) {
        roomId = previousRoomId
        let match = g.getMatch(roomId)
        if (match) {
            match.addPlayer(socket)
            if (!match.isFull())
                socket.emit('test')
        }
        else {
            findMatch()
        }
    })
    socket.on('disconnecting', function() {
        let match = g.getMatch(roomId)
        if (match) {
            match.removePlayer(socket)
            console.log(match)
        }
    })
})

server.listen(80, () => console.log('Example app listening on port 80!'))