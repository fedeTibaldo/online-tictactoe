const path = require('path')

class Room {
    constructor(id) {
        this.id = id
        this.players = 0
    }
    addPlayer() {
        if (this.players < 2)
            return this.players++ == 0 ? 'X' : 'O'
        return false
    }
}

let PROGRESSIVE_ID = 0

let private = []
let public = []

function getRoom(n) {
    console.log(private)
    for (let room of private.concat(public)) {
        if (room.id === n)
            return room
    }
    return false
}

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/static', express.static('assets'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home', {
        pageTitle: 'Online TicTacToe'
    })
})

app.get('/new', (req, res) => {
    res.render('new', {
        pageTitle: 'New Room @ Online TicTacToe'
    })
})

app.post('/new', (req, res) => {
    let type = req.body.type === 'private' ? 'private' : 'public'
    let room = new Room(PROGRESSIVE_ID)
    if (type == 'private')
        private.push( room )
    else
        public.push( room )
    res.redirect(`/room/${type}/${PROGRESSIVE_ID++}`)
})

app.get('/room/private/:roomId', (req, res) => {
    let room = getRoom(req.params.roomId)
    if (!room)
        res.sendStatus('404')
    let glyph = room.addPlayer()
    if (!glyph)
        res.sendStatus('403')
    res.cookie('room', { id: req.params.roomId, glyph: glyph }, { maxAge: 86400000 })
})

app.get('/room/full', (req, res) => {
    res.sendFile( path.resolve( __dirname, '') )
})

app.listen(80, () => console.log('Example app listening on port 80!'))