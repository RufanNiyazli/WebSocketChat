let stompClient = null;
let username = null;

function connect() {
    username = document.getElementById('username').value.trim();
    if (!username) return;

    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {
        // Login ekranını gizlə, chat ekranını göstər
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('chat-page').style.display = 'flex';

        // Ümumi mesajlar üçün abunə
        stompClient.subscribe('/topic/public', function (message) {
            showMessage(JSON.parse(message.body));
        });

        // Şəxsi mesajlar üçün abunə - /queue/private-{username}
        stompClient.subscribe('/user/queue/private', function (message) {
            console.log("Şəxsi mesaj gəldi: ", message.body);
            showMessage(JSON.parse(message.body), true);
        });

        // Yeni istifadəçi qoşuldu mesajı göndər
        stompClient.send("/app/chat.addUser", {}, JSON.stringify({
            sender: username,
            type: 'JOIN'
        }));
    });
}

function sendMessage() {
    const content = document.getElementById('message').value.trim();
    const recipient = document.getElementById('recipient').value.trim();

    if (!content) return;

    const message = {
        sender: username,
        content: content,
        type: 'CHAT'
    };

    if (recipient) {
        message.recipient = recipient;
        stompClient.send("/app/chat.privateMessage", {}, JSON.stringify(message));
    } else {
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
    }

    document.getElementById('message').value = '';
}

function showMessage(message, isPrivate = false) {
    console.log("HTML-ə yazıram:", message, "Private:", isPrivate);

    const messageArea = document.getElementById('messageArea');
    if (!messageArea) {
        console.error("messageArea tapılmadı!");
        return;
    }

    const msgElement = document.createElement('div');
    msgElement.className = isPrivate ? 'message private' : 'message';

    if (message.type === 'JOIN') {
        msgElement.textContent = `${message.sender} daxil oldu.`;
    } else if (message.type === 'LEAVE') {
        msgElement.textContent = `${message.sender} çıxış etdi.`;
    } else {
        msgElement.textContent = `${message.sender}: ${message.content}` + (isPrivate ? ' (şəxsi)' : '');
    }

    messageArea.appendChild(msgElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}
