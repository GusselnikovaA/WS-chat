import View from './partials/view.js';

const ws = new WebSocket("ws://localhost:8080");

const auth = document.querySelector('.auth');
const authInputName = document.querySelector('.auth__name');
const authInputNick = document.querySelector('.auth__nick');
const authButton = document.querySelector('.auth__button');

const chatWindow = document.querySelector('.global');

const messageInput = document.querySelector('.message__input');
const sendButton = document.querySelector('.message__button');
const messageContainer = document.querySelector('.message-container');

const userInfo = document.querySelector('.user-info');

const userAvatar = document.querySelector('.user__avatar');
const userName = document.querySelector('.user__name');
const userNick = document.querySelector('.user__nick');

// const userPhotos = document.querySelectorAll('.user__avatar');
const userOnline = document.querySelector('.user-online');
const usersOnline = document.querySelector('.user-online__number');

const photo = document.querySelector('.photo');
// const photoContainer = document.querySelector('.photo-wrap');
const photoContainer = document.querySelector('#loadingAvatar');
const photoSave = document.querySelector('#photo__save');
const photoCancel = document.querySelector('#photo__cancel');

let avatar;

const user = {
    list: []
};

// соединение с сервером. Запуск авторизации
ws.onopen = function (e) {
    console.log("[open] Соединение установлено");
    authorization();
};

// получение данных с сервера
ws.onmessage = function (message) {
    let messageBody = JSON.parse(message.data); 
    console.log(`[message] Данные получены с сервера: ${messageBody}`);

    if (messageBody.type == 'allUsers') {
        addOnlineUsers(messageBody);
    } else if (messageBody.content.type == 'newUser') {
        addUser(messageBody);
    } else if (messageBody.content.type == 'photo') {
        addAvatar(messageBody);
    } else if (messageBody.content.type == 'message') {
        addMessage(messageBody);
    }
};

// ошибка подключения ws
ws.onerror = function () {
    console.log(`[error] ${error.message}`);
};

// открывает и закрывает pop up окна
function changeWindow (closeWindow, openWindow) {
    closeWindow.classList.remove('show');
    closeWindow.classList.add('hide');
    openWindow.classList.remove('hide');
    openWindow.classList.add('show');
}

// авторизация пользователя
function authorization () {
    authButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (authInputName.value != '' && authInputNick.value != '') {
            changeWindow(auth, chatWindow);

            userAvatar.lastElementChild.src = 'img/photo-camera.png';
            // userAvatar.classList.add(authInputNick.value);
            userAvatar.dataset.nick = authInputNick.value;
            userName.innerHTML = authInputName.value;
            userNick.innerHTML = authInputNick.value;

            ws.send(JSON.stringify({
                type: 'newUser',
                data: {
                    name: authInputName.value,
                    nick: authInputNick.value,
                    photo: 'img/photo-camera.png'
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

// добавление пользователя
function addUser(message) {
    user.list.push({
        photo: message.content.data.photo,
        name: message.content.data.name,
        nick: message.content.data.nick
    });
}

// добавление пользователей онлайн
function addOnlineUsers(message) {
    userOnline.innerHTML = View.render('userOnlineTemplate', message.allUsers);
    usersOnline.innerText = message.allUsers.list.length;
}

// отправка сообщения на сервер
function sendMessage() {
    if (messageInput.value != '') {
        ws.send(JSON.stringify({
            type: 'message',
            data: messageInput.value
        }));
        messageInput.value = '';
    }
}

// обработчик отправки сообщения
sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
});

// добавление сообщения на клиенте
function addMessage(message) {
    const date = new Date();
    let time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    let newMessage = {
        name: message.client.name,
        nick: message.client.nick,
        photo: message.client.photo,
        messageText: message.content.data,
        time: time
    }

    let newMessageContainer = document.createElement('div');
    newMessageContainer.classList.add('message-item');

    newMessageContainer.innerHTML = View.render('messageTemplate', newMessage);

    if (newMessage.nick === userAvatar.dataset.nick) {
        newMessageContainer.classList.add('message_my');
        newMessageContainer.firstElementChild.classList.add('message_my__avatar');
        newMessageContainer.lastElementChild.classList.add('message_my__content');
    }

    messageContainer.append(newMessageContainer);

    // [...messageContainer.children].forEach (child => {
    //     if (child.classList.contains(newMessage.nick)) {

    //     }
    // })

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// добавление аватара на клиенте
function addAvatar(message) {
    let serverNick = message.client.nick;
    let serverName = message.client.name;
    let userArray = user.list;

    userArray.forEach(item => {
        if (serverName == item.name && serverNick == item.nick) {
            item.photo = message.content.data; 
            const avatarUrl = item.photo;
            searchAvatarContainer(chatWindow, avatarUrl, serverNick);
        }
    });
}

// поиск нужного элемента для загрузки аватара
function searchAvatarContainer (where, url, serverNick) {
    const children = [...where.children];
    for (const element of children) {
        if (element.parentNode.classList.contains('user__avatar') && element.parentNode.dataset.nick == serverNick) {
            element.src = url;
        }

        if (element.children.length > 0) {
            searchAvatarContainer(element, url, serverNick);
        }
    }
}

// загрузка аватара и отправка на сервер
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

    photoSave.addEventListener('click', (e) => {
        e.preventDefault();
        ws.send(JSON.stringify({
            type: 'photo',
            data: avatar
        }));
        changeWindow(photo, chatWindow);
    });

    photoCancel.addEventListener('click', (e) => {
        e.preventDefault();
        changeWindow(photo, chatWindow);
    });
}

// обработчкик загрузки аватара (делегирование) 
userInfo.addEventListener('change', (e) => {
    const element = e.target;

    if (element.classList.contains('user__photo')) {
        loadAvatar(element);
    }
});

