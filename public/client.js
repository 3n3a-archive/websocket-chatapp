let socket = io();

let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let usrElement = document.getElementById('username');
let username;

function addMsg(msg, sent=false) {
    let item = document.createElement('li');
    item.textContent = msg.msg;
    item.classList.add("message")
    item.classList.add(sent || msg.usr == username ? "send": "receive")
    
    if (msg.usr != username) {
        item.insertAdjacentHTML("afterbegin", `<span class="below">${msg.usr}</span>`)
    }
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

function setUsername(usr) {
    username = usr
    usrElement.textContent = username
}

async function listenForUsername() {
    socket.on('username', function(uname) {
        setUsername(uname)
        localforage.setItem("username", uname)
    })
    socket.emit('username', null)
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        let msg = {usr: username, msg: input.value}
        socket.emit('chat message', JSON.stringify(msg));
        addMsg(msg, true)
        input.value = '';
    }
});

localforage.getItem("username").then(
    function (value) {
        if (value != null) {
            setUsername(value)
            console.log(username)
        } else {
            listenForUsername()
        }
    }
).catch(
    function (error) {
        console.error('error', error)
        listenForUsername()
    }
)

socket.on('chat message', function(msg) {
    addMsg(JSON.parse(msg))
});