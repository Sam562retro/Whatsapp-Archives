const express = require('express');
const router = express.Router()
const chatModel = require("./model");

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
  })
  
const upload = multer({ storage: storage })

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
    res.redirect('/')
})

module.exports = router;