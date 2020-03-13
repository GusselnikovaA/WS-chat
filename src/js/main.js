import View from './view.js';

const Handlebars = require("handlebars");
// const ws = new WebSocket("ws://localhost:8080");

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

// отслеживаем установление соединения с сервером
// ws.on('open', function open() {
    authButton.addEventListener('click', () => {
        if (authInputName != '' && authInputNick != '') {
            user.name = authInputName.value;
            user.nick = authInputNick.value;
            user.img = '../img/photo-camera.png';

            console.log(user);

            changeWindow(auth, chatWindow);
            userInfo.innerHtml = View.render('userInfo', user);
        }
    });
// });

// открывает и закрывает pop up окна
function changeWindow (closeWindow, openWindow) {
    closeWindow.classList.remove('show');
    closeWindow.classList.add('hide');
    openWindow.classList.remove('hide');
    openWindow.classList.add('show');
}
   

// создает элемент с сообщением полученным с сервера и выводит на экран
function addMessage(message) {
    const messageItem = document.createElement('div');

    messageItem.className = 'message-item';
    messageItem.textContent = message;

    messageContainer.appendChild(messageItem);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// отслеживаем получение сообщения с сервера
// ws.on('message', function incoming(data) {
//     addMessage(data);
// });

// отправка введенного сообщения на сервер
// function sendMessage() {
//     ws.send(messageInput.value);
//     messageInput.value = '';
// }

// sendButton.addEventListener('click', () => {
//     if (messageInput.value != '') {
//         sendMessage();
//     }
// });