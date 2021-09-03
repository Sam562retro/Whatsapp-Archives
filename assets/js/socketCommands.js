const socket = io();
var currentActive = "";

socket.on('changeWindow', (data) => {
    console.log(data[0]);
    document.getElementById('chatTitle').innerHTML=data[0].title;
    currentActive = data[0].title;
    document.getElementById("updateBtn").disabled = false;
})

function go(){
    location.href=`/updateChat/${currentActive}`
}

function emitDataRequest (title){
    socket.emit('getChatData', title)
}