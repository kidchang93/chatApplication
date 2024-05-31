'use strict';

// 각 변수들의 DOM요소를 선택하기위해 먼저 변수 선언을 한다.
var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");

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

        var socket = new SockJS('/ws');
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

function onError(error){
    connectingElement.textContent = '웹소켓 서버에 연결할 수 없습니다.';
    connectingElement.style.color = 'red';
}









function onMessageReceived(payload) {
    /*페이로드에서 먼저 JSON을 추출
    * 그 다음 li 태그가 ul 하위에 표시. */

    var message = JSON.parse(payload.body)

    var messageElement = document.createElement('li');

    /*message.tpe 에 따라 보내지는 메세지*/
    if (message.type === 'JOIN'){
        messageElement.classList.add('event-message');
        message.content = message.sender + 'joined!';
    } else if (message.type === 'LEAVE'){
        messageElement.classList.add('event-message');
        message.content = message.sender + 'left!';
    } else {
        messageElement.classList.add('chat-message');


        // 메세지를 보낸사람의 색깔을 구성하기 위한 과정
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
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;

}


function sendMessage(event) {

    var messageContent = messageInput.value.trim();

    // 클라이언트가 끊어졌을 때마다 봐야돼
    if (messageContent && stompClient){
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type:'CHAT'
        }
        stompClient.send('/add/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}



function getAvatarColor(messageSender) {

    var hash = 0;
    for (var i = 0; i < messageSender.length; i++){
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    /* 무작위 색상 테이블에서 값을 반환 */
    var index = Math.abs(hash % colors.length);
    return colors[index];

}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);