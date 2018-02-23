var http= require("http");
var fs = require("fs");
var text="";


var data=fs.readFile('sample.txt', function(err, data){
    if(err) return console.error(err);
    text=data.toString();
});

http.createServer(function(request, response){
    response.writeHead(200,{'Content-Type':'text/html'});
    response.end(text);
}).listen('9090');

var connectHandler = function connected(){
    console.log('Connected successfully');
    eventEmitter.emit('data_received');
}

eventEmitter.on('connection',connectHandler);

eventEmitter.on('data_received', function(){
    console.log('data received successfully');
});

eventEmitter.emit('connection');

console.log('End of file read');