/*
    server.js
    main server script for the socket.io chat demo
*/

var net = require('net');

var server = net.createServer();

var clients = [];

server.on('connection', function(socket) {
    console.log('connection received');

    client.push(socket);

    var broadcast = function(name, message) {
        clients.forEach(function(client) {
            client.write('[' + name + ']' + message + '\n');
        });
    }

    var name;

    socket.write('What is your name?\n');

    socket.on('data', function(data) {
        var data = data.toString();
        data = data.substring(0, data.length-1);

        if(name == undefined) {
            name = data;
            socket.write('Hello, ' + name + '\n');
            console.log(name + ' has signed in');
        } else {
            broadcast(name, data);
        }
        //console.log(data);
    });

    //socket.end();
});

var port = 3000;
server.on('listening', function() {
    console.log('Server now running on ' + port);
});

server.listen(port);