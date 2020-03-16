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
const avatar = document.getElementById('avatar');
const photoInput = document.querySelector('#user__photo');
const photoSave = document.querySelector('#photo__save');
const photoCancel = document.querySelector('#photo__cancel');


const user = {};


// отслеживаем установление соединения с сервером
ws.onopen = function (e) {
    console.log("[open] Соединение установлено");
    authorization();
    onlineUsers.innerText = 1;
};

// авторизация пользователя
function authorization () {
    authButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (authInputName.value != '' && authInputNick.value != '') {
            user.name = authInputName.value;
            user.nick = authInputNick.value;
            user.photo = 'img/photo-camera.png';

            changeWindow(auth, chatWindow);
            userInfo.innerHTML = View.render('userInfoTemplate', user);

            ws.send(JSON.stringify(user));
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
   

// выводит сообщение на экран на экран
// надо добавить проверку кем отправлено сообщение, пользователем или нет
function addMessage(message) {
    messageContainer.innerHTML = View.render('messageTemplate', message);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// отслеживаем получение данных с сервера
ws.onmessage = function (event) {
    console.log(`[message] Данные получены с сервера: ${event.data}`);
    addMessage(event.data);
};

// ошибка 
ws.onerror = function () {
    console.log(`[error] ${error.message}`);
};

// отправка введенного сообщения на сервер
function sendMessage() {
    ws.send(messageInput.value);
    messageInput.value = '';
}

sendButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (messageInput.value != '') {
        sendMessage();
    }
});

// загрузка аватара
function loadAvatar(e) {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', (e) => {
        avatar.src = fileReader.result;
    })

    const file = e.target.files[0];

    if (file) {
        if (file.size > 300 * 1024) {
            alert('Слишком большой файл')
        } else {
            photo.classList.add('show');
            fileReader.readAsDataURL(file);
        }
    }
};

userInfo.addEventListener('click', (e) => {
    if (e.target.classList.contains('user__photo')) {
        loadAvatar(e);
    }
})