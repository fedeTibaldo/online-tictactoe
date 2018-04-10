/* ExpressJS */
const express = require('express')
const app = express()
const server = require('http').Server(app)
/* Socket.IO */
const io = require('socket.io')(server)

function getRefererFromRequest(request, siteURL) {
    return request.headers.referer.replace(siteURL, '')
}

app.use('/static', express.static('assets'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home', {
        pageTitle: 'Online TicTacToe'
    })
})

app.get('/join', (req, res) => {
    res.render('join', {
        pageTitle: 'Join Game @ Online TicTacToe'
    })
})

app.get('/play', (req, res) => {
    res.render('game', {
        pageTitle: 'Play @ Online TicTacToe',
    })
})

io.on('connection', function(socket){
    console.log(`a user connected`);
    console.log(getRefererFromRequest(socket.request, 'http://localhost'));
    socket.on('disconnect', (reason) => {
        console.log(`a user disconnected`);
    });
});

server.listen(80, () => console.log('Example app listening on port 80!'))