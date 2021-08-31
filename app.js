const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./router');

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
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', router);

app.listen('7000');