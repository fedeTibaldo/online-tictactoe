/* ExpressJS */
const express = require('express')
const app = express()
const server = require('http').Server(app)
/* Socket.IO */
const io = require('socket.io')(server)

let waitingPlayer = undefined

app.use('/static', express.static('assets'))
app.set('view engine', 'ejs')

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

io.on('connection', function(socket){
    if (!waitingPlayer)
        waitingPlayer = socket
    else {
        let room = `${waitingPlayer.id}${socket.id}`
        socket.join(room)
        waitingPlayer.join(room)
        socket.emit('match successful')
        waitingPlayer.emit('match successful')
        waitingPlayer = undefined
    }
    socket.on('disconnecting', () => {
        if (waitingPlayer && socket.id === waitingPlayer.id)
            waitingPlayer = undefined
        for(let room of Object.keys(socket.rooms))
            socket.to(socket.rooms[room]).emit('sync error')
    });
});

server.listen(80, () => console.log('Example app listening on port 80!'))