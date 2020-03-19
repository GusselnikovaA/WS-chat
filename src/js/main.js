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

// выводит сообщение на экран на экран
// надо добавить проверку кем отправлено сообщение, пользователем или нет
function addMessage(message) {
    const date = new Date();
    let time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    messageContainer.innerHTML = View.render('messageTemplate', message);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// добавление пользователя
function addUser(message) {
    user.list.push({
        photo: message.content.data.photo,
        name: message.content.data.name,
        nick: message.content.data.nick
    });

    console.log(user)
    // let serverNick = message.client.nick;
    // let serverName = message.client.name;
    // let userArray = user.list;
    // console.log(serverName);

    // userArray.forEach(item => {
    //     if (serverName == item.name && serverNick == item.nick) {
    //         userInfo.innerHTML = View.render('userInfoTemplate', item);
    //     }
    // });
}

// добавление пользователей онлайн
function addOnlineUsers(message) {
    userOnline.innerHTML = View.render('userOnlineTemplate', message.allUsers);
    usersOnline.innerText = message.allUsers.list.length;
}

// добавление аватара на клинт
function addAvatar(message) {
    let serverNick = message.client.nick;
    let serverName = message.client.name;
    console.log(serverName);
    let userArray = user.list;
    console.log(userArray)

    userArray.forEach(item => {
        if (serverName == item.name && serverNick == item.nick) {
            item.photo = message.content.data; 
            const avatarUrl = item.photo;
            search(chatWindow, avatarUrl);
        }
    });

    // userArray.forEach(item => {
    //     if (serverName == item.name && serverNick == item.nick) {
    //         item.photo = message.content.data;
    //         const avatarUrl = item.photo;
    //         search(chatWindow, avatarUrl);
    //     }
    // });
}

// поиск нужного элемента
function search (where, url) {
    const children = [...where.children];
    for (const element of children) {
        if (element.parentNode.classList.contains('user__avatar')) {
            element.src = url;
        }

        if (element.children.length > 0) {
            search(element, url);
        }
    }
}

// отправка сообщения на сервер
function sendMessage() {
    if (messageInput.value != '') {
        ws.send({
            type: 'message',
            data: messageInput.value 
        });
        messageInput.value = '';
    }
}

// обработчик отправки сообщения
sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
});

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

