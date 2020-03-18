// подключение модуля
const WebSocket = require('ws');

// создаем сервер через порт 8080
const server = new WebSocket.Server({
    port: 8080,
    clientTracking: true
});
const users = {
    type: 'allUsers',
    allUsers: {
        list: []
    }
};

// отслеживаем событие connection
server.on('connection', function connection(ws) {
    // отправка данных обо всех онлайн пользователях
    if (users.allUsers.list.length) {
        ws.send(JSON.stringify({users}));
    }
    // пришли данные с клиента
    ws.on('message', function incoming(message) {
        let messageBody = JSON.parse(message);

        // если поступили данные о новом пользователе
        if(messageBody.type == 'newUser') {
            ws.user = messageBody.data;
            users.allUsers.list.push(ws.user);

            server.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({content: messageBody, client: ws.user}));
                    client.send(JSON.stringify(users));
                }
            });
        // если поступили данные о фотографии пользователя
        } else if (messageBody.type == 'photo') {
            ws.user.photo = messageBody.data;

            server.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({content: messageBody, client: ws.user}));
                }
            });
        // если поступили данные о сообщении
        } else if (messageBody.type == 'message') {
            server.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({content: messageBody, client: ws.user}));
                }
            });
        }
    });

    // закрытие подключения
    ws.on('close', (e) => {
        users.allUsers.list.forEach(function(user, i) {
            if (ws.user && user.name == ws.user.name) {
                users.allUsers.list.splice(i, 1);
            }
        });
        server.clients.forEach(function each(client) {
            client.send(JSON.stringify({users}));
        });
    });
});