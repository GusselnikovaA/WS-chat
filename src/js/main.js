// создаем websocket клиентской части
const ws = new WebSocket("ws://localhost:8080");

const messageInput = document.querySelector('.message__input');
const sendButton = document.querySelector('.message__button');
const messageContainer = document.querySelector('.message-container');

// отслеживаем установление соединения с сервером
ws.on('open', function open() {
    // что сюда записывать???
    ws.send('something');
});
   

// создает элемент с сообщением полученным с сервера и выводит на экран
function addMessage(message) {
    const messageItem = document.createElement('div');

    messageItem.className = 'message__item';
    messageItem.textContent = message;

    messageContainer.appendChild(messageItem);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// отслеживаем получение сообщения с сервера

ws.on('message', function incoming(data) {
    addMessage(data);
});

// отправка введенного сообщения на сервер
function sendMessage() {
    ws.send(messageInput.value);
    messageInput.value = '';
}

sendButton.addEventListener('click', () => {
    if (messageInput.value != '') {
        sendMessage();
    }
});