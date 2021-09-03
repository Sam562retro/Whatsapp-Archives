const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = require('./router');
const chatModel = require("./model")
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = new socketIo.Server(server);

const connection = () => {
    mongoose.connect('mongodb://localhost/whatsappArchive', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected With Mongo DB');
};

connection();

app.use(express.static('assets'))
app.set('view engine', 'ejs');

app.use('/', router);

io.on('connection', (socket) => {
    socket.on('getChatData', (chatName) => {
        chatModel.find({title : chatName}).then((data => {
            socket.emit('changeWindow', data)
        }))
    })
})

server.listen('7000');