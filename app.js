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

function resumeGame(socket) {
    if (typeof socket.request.session.room !== 'undefined') {
        console.log('here')
        let clients = io.sockets.clients(socket.request.session.room)
        if (clients.length > 1) {
            //resume
        } else {
            socket.emit('room empty')
        }
        return true
    }
}

function createRoom(p1, p2) { 
    let roomId = `${p1.id}${p2.id}`
    //games[roomId] = new Game()
    return roomId
}

function nextMove() { }

io.on('connection', function(socket) {
    socket.on('queue', function() {
        if (!waitingPlayer)
            return waitingPlayer = socket
        let roomId = createRoom(waitingPlayer, socket);
        [socket, waitingPlayer].forEach( p => p.emit('match', roomId) )
    })
    socket.on('start', function(roomId) {
        // if player left room
        //  add it again
        // if player is alone
        //  socket.emit('empty')
        // else
        //  start game
    })
})

server.listen(80, () => console.log('Example app listening on port 80!'))