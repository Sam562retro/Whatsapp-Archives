const socket = io();
var currentActive = "";

socket.on('changeWindow', (data) => {
    document.getElementById('chatArea').innerHTML = "";
    const info = data[0];
    document.getElementById('chatTitle').innerHTML=info.title;
    currentActive = info.title;
    document.getElementById("updateBtn").disabled = false;
    info.content.forEach(message => {
        const messageWrap = document.createElement('div');
        messageWrap.classList.add('card');
        messageWrap.classList.add('bg-secondary');
        messageWrap.classList.add('message');
        messageWrap.innerHTML = `
                <div class="card-header">
                    <p class="text-muted">${message.date} ${message.time} . ${message.author}</p>
                </div>
                <div class="card-body">
                    <p>
                        ${message.message}
                    </p>
                </div>`

        document.getElementById('chatArea').appendChild(messageWrap);
        document.getElementById('chatArea').scrollTop = 100;
    })
})

function go(){
    location.href=`/updateChat/${currentActive}`
}

function emitDataRequest (title){
    socket.emit('getChatData', title)
}