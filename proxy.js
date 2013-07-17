//http://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-node-js
//http://www.dzone.com/snippets/execute-unix-command-nodejs
//http://www.catonmat.net/http-proxy-in-nodejs/#comments

var http = require('http');
var sys  = require('sys');
var url = require('url');

var exec = require('child_process').exec;

http.createServer(function(request, response) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;

  if(new RegExp('.*?www.google.com.*q=.*').test(request.url)){
    sys.log(request.connection.remoteAddress + ": " + request.method + " " + request.url);
	sys.log("q is " + query.q);
	say(query.q);
	response.write('<html><body><h1>No I AM not :P</h1></body></html>', 'utf8');
	response.end();
	return;
  }
  var proxy = http.createClient(80, request.headers['host']);
  var proxy_request = proxy.request(request.method, request.url, request.headers);
  proxy_request.addListener('response', function (proxy_response) {
    proxy_response.addListener('data', function(chunk) {
      response.write(chunk, 'binary');
    });
    proxy_response.addListener('end', function() {
      response.end();
    });
    response.writeHead(proxy_response.statusCode, proxy_response.headers);
  });
  request.addListener('data', function(chunk) {
    proxy_request.write(chunk, 'binary');
  });
  request.addListener('end', function() {
    proxy_request.end();
  });
}).listen(8080);

function say(text){
	exec('say "' + text + '"', function(error, stdout, stderr){});
}
