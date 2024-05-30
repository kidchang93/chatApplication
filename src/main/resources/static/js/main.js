'use strict';

// 각 변수들의 DOM요소를 선택하기위해 먼저 변수 선언을 한다.
var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector("#connecting");

// 변수 선언
var stompClient = null;
var username =null;
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];



// 사용자 이름 양식
function connect(event){
    username = document.querySelector('#name').value.trim();
    if (username){
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SocketJS('/ws');
        stompClient = Stomp.over(socket);
        // 연결하려면 매개변수들이 있어야함.
        stompClient.connect({}, onConnected, onError);
    }
    //a 태그나 submit 태그는 누르게 되면 href 를 통해 이동하거나 , 창이 새로고침하여 실행됩니다.
    // preventDefault 를 통해 이러한 동작을 막아줄 수 있습니다.
    event.preventDefault();
}

function onConnected() {
    // subscribe to the public Topic (구독)
    stompClient.subscribe('/topic/public', onMessageReceived);

    // tell username to the server
    stompClient.send('/app/chat.addUser', {},
        JSON.stringify({sender: username, type:'JOIN'}));
    connectingElement.classList.add('hidden');
}

function onError(){
    connectingElement.textContent = '웹소켓 서버에 연결할 수 없습니다.';
    connectingElement.style.color = 'red';
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body)

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN'){
        messageElement.classList.add('event-message');
        message.content = message.sender + 'joined!';
    } else if (message.type === 'LEAVE'){
        messageElement.classList.add('event-message');
        message.content = message.sender + 'left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(textElement);

}
usernameForm.addEventListener('submit', connect, true);



messageForm.addEventListener('submit', sendMessage, true);

function sendMessage() {

    var messageContent = messageInput.value.trim();
    
    // 클라이언트가 끊어졌을 때마다 봐야돼
    if (messageContent && stompClient){
        var chatMessage = {
            sender: username,
            content: messageContent,
            type:'CHAT'
        }

        stompClient.send('/add/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.content = '';
    }
    event.preventDefault();
}