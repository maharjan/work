var server= require("http");

server.createServer(function(request, response){

    response.writeHead(200,{'Content-Type':'text/html'});
    response.end('Hello world');
}).listen(8080);

console.log('Server running at 8080');