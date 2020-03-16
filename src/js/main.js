import View from './partials/view.js';

const ws = new WebSocket("ws://localhost:8080");
console.log(ws);

const auth = document.querySelector('.auth');
const authInputName = document.querySelector('.auth__name');
const authInputNick = document.querySelector('.auth__nick');
const authButton = document.querySelector('.auth__button');

const chatWindow = document.querySelector('.global');

const messageInput = document.querySelector('.message__input');
const sendButton = document.querySelector('.message__button');
const messageContainer = document.querySelector('.message-container');

const userInfo = document.querySelector('.user-info');
const userInfoTemplate = document.getElementById("userInfoTemplate");
const onlineUsers = document.querySelector('.user-online__number');

const photo = document.querySelector('.photo');
const photoContainer = document.querySelector('.photo-wrap');
const photoInput = document.querySelector('#user__photo');
const photoSave = document.querySelector('#photo__save');
const photoCancel = document.querySelector('#photo__cancel');


const user = {};
const nicks = [];


// отслеживаем установление соединения с сервером
ws.onopen = function (e) {
    console.log("[open] Соединение установлено");
    authorization();
    onlineUsers.innerText = 1;
};

// авторизация пользователя
function authorization () {
    authButton.addEventListener('click', () => {
        if (authInputName.value != '' && authInputNick.value != '') {
            user.name = authInputName.value;
            user.nick = authInputNick.value;
            user.img = 'img/photo-camera.png';

            changeWindow(auth, chatWindow);
            userInfo.innerHTML = View.render('userInfoTemplate', user);

            ws.send(user);
        } else  if (authInputName.value === '' && authInputNick.value === '') {
            authInputName.classList.add('auth__input_error');
            authInputNick.classList.add('auth__input_error');
        } else  if (authInputName.value === '') {
            authInputName.classList.add('auth__input_error');
            authInputNick.classList.remove('auth__input_error');
        } else if (authInputNick.value === '') {
            authInputNick.classList.add('auth__input_error');
            authInputName.classList.remove('auth__input_error');
        }
    });
}

// открывает и закрывает pop up окна
function changeWindow (closeWindow, openWindow) {
    closeWindow.classList.remove('show');
    closeWindow.classList.add('hide');
    openWindow.classList.remove('hide');
    openWindow.classList.add('show');
}
   

// выводиn сообщение на экран на экран
// надо добавить проверку кем отправлено сообщение, активным пользователем или нет
function addMessage(message) {
    messageContainer.innerHTML = View.render('messageTemplate', message);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// отслеживаем получение сообщения с сервера
ws.onmessage = function (event) {
    console.log(`[message] Данные получены с сервера: ${event.data}`);
    addMessage(event.data);
};

ws.onerror = function () {
    alert('Соединение закрыто или не может быть открыто!');
};
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