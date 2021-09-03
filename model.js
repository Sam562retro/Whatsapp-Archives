const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : [Object],
        default : []
    },
    lastUploadDate : {
        type : String,
        default : Date.parse("Mon Jan 01 0000 00:00:00 GMT+0530 (India Standard Time)")
    }
});

module.exports = mongoose.model('Chat', chatSchema);