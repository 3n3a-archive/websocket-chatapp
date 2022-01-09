const express = require('express');
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const uname = require('username-generator');

let messages = [];

app.use(express.static('public'))

app.get('/socket.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.min.js');
});
app.get('/store.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/localforage/dist/localforage.min.js')
})

io.on('connection', (socket) => {
    // Send username
    socket.on('username', () => {
        socket.emit('username', uname.generateUsername())
    })

    // Send all previous messages
    for (const msg of messages) {
        socket.emit('chat message', msg);
    }

    // (on chat message) Send new message to all except sender
    socket.on('chat message', (msg) => {
        messages.push(msg)
        socket.broadcast.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});