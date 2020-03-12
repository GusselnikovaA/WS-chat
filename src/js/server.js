// подключение модуля
const WebSocket = require('ws');

// создаем сервер через порт 8080
const server = new WebSocket.Server({
    port: 8080,
    clientTracking: true
});

const clients = [];

// отслеживаем событие connection
server.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        // написать, что мы делаем с поступившим с клиента данными
        // отправляем всем клиентам например 
        server.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(data);
            }
        });
    });
});