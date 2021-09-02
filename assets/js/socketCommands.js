const socket = io();

socket.on('changeWindow', (data) => {
    console.log(data);
})

function emitDataRequest (title){
    socket.emit('getChatData', title)
}