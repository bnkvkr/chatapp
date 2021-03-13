const socket = io()
let name;
var sent = new Audio("horsesend.mp3");
var rcv = new Audio("sheeprcv.mp3");
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let btn = document.querySelector(".btn");
let room = document.querySelector(".room");
let feedback = document.querySelector(".typing");
do {
    name = prompt('Please enter your name: ')
} while(!name)
// room.innerHTML = `${name}'s Chat Room`;
socket.emit('joined',name);
btn.addEventListener("click",(e)=>{
    socket.emit('not-typing');
   typeof(textarea.value);
    if(textarea.value.trim().length != 0)
    {
        sendMessage(textarea.value)
        sent.play();

    }
    
    
})
textarea.addEventListener('keyup', function(e){
    if(textarea.value.length > 0){
      socket.emit('typing', name);
    }
    else
    {
        socket.emit('not-typing');
    }
    
  });
textarea.addEventListener('keyup', (e) => {
   
        if(e.key === 'Enter') {
            
            socket.emit('not-typing');
          
            if(e.target.value.trim().length !=0)
            {

                sendMessage(e.target.value);
                sent.play();
            }
        }
    
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    rcv.play();
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}


//joined
socket.on('joined',(name)=>{
    let mainDiv = document.createElement('div')
    let className = 'joined'
    mainDiv.classList.add(className, 'message')

    let markup = `
        
        <p>${name} joined the chat</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    scrollToBottom()
})

//typing''
socket.on('typing', function(nam){
    feedback.innerHTML = `${nam} is typing...`;
});
socket.on('not-typing', function(){
    feedback.innerHTML = ``;
});