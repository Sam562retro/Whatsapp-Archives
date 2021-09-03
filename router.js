const express = require('express');
const router = express.Router()
const chatModel = require("./model");
const fs=require("fs");

const multer  = require('multer');
const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
  })
  
const upload = multer({ storage: storage1 })

router.get('/', async(req, res) => {
    let chats = [];
    await chatModel.find().then((data) => {
        data.forEach((chat) => {
            chats.push(chat.title);
        })
    })
    res.render("uploadAndSee", {chats});
})

router.get('/addChat', (req, res) => {
    res.render("addChat");
})

router.post('/addChat', upload.none(), (req, res) => {
    new chatModel({
        title : req.body.chatTitle
    }).save().catch(err => {
        res.send(err);
    }).then(data => {
        res.redirect(`/`);
    })
})

router.get('/updateChat/:chatTitle', (req, res) => {
    res.render('updateChat', {chatTitle : req.params.chatTitle});
})

router.post('/updateChat/:chatTitle', upload.single('chatUpdateFile'), (req, res) => {
    let file = req.file
    let data = '';
    let dataArranged = [];
    let dataSetup1 = [];
    let dataSetup2 = [];
    var readerStream = fs.createReadStream(`./uploads/${file.filename}`);
    readerStream.setEncoding('UTF8'); 
    readerStream.on('data', function(chunk) {
       data += chunk
    });
    readerStream.on('end', function(){
        dataSetup1 = data.split('\n');
        dataSetup1.forEach(lines => {
            if(lines.charAt(2) === '/' && lines.charAt(5) === '/' && lines.charAt(10) === ',' && lines.charAt(14) === ':' && lines.charAt(18) === '-'){
                const date = `${lines.charAt(0)}${lines.charAt(1)}/${lines.charAt(3)}${lines.charAt(4)}/${lines.charAt(6)}${lines.charAt(7)}${lines.charAt(8)}${lines.charAt(9)}`;
                const time = `${lines.charAt(12)}${lines.charAt(13)}:${lines.charAt(15)}${lines.charAt(16)}`;
                lines = lines.substring(19, lines.length)
                let lineObject = {
                    date : date,
                    time : time,
                    author : lines.substring(0, lines.indexOf(":")),
                    message : lines.substring(lines.indexOf(':') + 1, lines.length)
                }
                dataSetup2.push(lineObject);
            }else{
                const fullMessage = dataSetup2[dataSetup2.length-1].message + lines
                dataSetup2[dataSetup2.length-1].message = fullMessage;
            }
        })
        chatModel.findOneAndUpdate({title : req.params.chatTitle}, {content : dataSetup2, lastUploadDate : Date.parse(`${dataSetup2[dataSetup2.length-1].date} ${dataSetup2[dataSetup2.length-1].time}:00 GMT+0530 (India Standard Time)`)}, { new: true }).catch(err => {console.log(err)});
    })
    readerStream.on('error', function(err) {
        console.log(err.stack);
    });
    res.redirect('/')
})

module.exports = router;