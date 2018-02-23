var events = require('events');
var http= require("http");

var eventEmitter = new events.EventEmitter();

var connectHandler = function connected(){
    console.log('Connected successfully');
    eventEmitter.emit('data_received');
}

eventEmitter.on('connection',connectHandler);

eventEmitter.on('data_received', function(){
    console.log('data received successfully');
});

eventEmitter.emit('connection');

http.createServer(function(request, response){
    response.writeHead(200,{'Content-Type':'text/html'});
}).listen('9090');