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
const userPhotos = document.querySelectorAll('.user__avatar');
const onlineUsers = document.querySelector('.user-online__number');

const photo = document.querySelector('.photo');
// const photoContainer = document.querySelector('.photo-wrap');
const photoContainer = document.querySelector('#loadingAvatar');
const photoSave = document.querySelector('#photo__save');
const photoCancel = document.querySelector('#photo__cancel');

let avatar;


const user = {};


// отслеживаем установление соединения с сервером
ws.onopen = function (e) {
    console.log("[open] Соединение установлено");
    console.log('saveAvatar', userPhotos);
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

            ws.send(JSON.stringify({
                type: 'newUser',
                data: {
                    name: user.name,
                    nick: user.nick,
                    photo: user.photo
                }
            }));
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

// загрузка аватара в pop up окно
function loadAvatar(input) {
    changeWindow(chatWindow, photo);
    const file = input.files[0];

    if (file) {
        const fileReader = new FileReader();

        fileReader.onloadend = function (e) {
            photoContainer.src = fileReader.result;
            avatar = fileReader.result;
        };

        fileReader.readAsDataURL(file);
    }
}

// отправляем аватар на сервер
function saveAvatar() {
    ws.send(JSON.stribgify({
        type: 'photo',
        data: avatar
    }))
}


userInfo.addEventListener('change', (e) => {
    const element = e.target;
    console.log('listeener', userPhotos);

    if (element.classList.contains('user__photo')) {
        loadAvatar(element);
    }

    photoCancel.addEventListener('click', () => {
        changeWindow(photo, chatWindow);
    });

    photoSave.addEventListener('click', (e) => {
        saveAvatar();
        changeWindow(photo, chatWindow);
    });
});

