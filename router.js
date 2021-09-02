const express = require('express');
const router = express.Router()
const chatModel = require("./model");

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
router.post('/addChat', (req, res) => {
    new chatModel({
        title : req.body.chatTitle
    }).save().catch(err => {
        res.send(err);
    }).then(data => {
        res.redirect(`/`);
    })
})
router.post('/updateChat/:chatTitle',  (req, res) => {})

module.exports = router;