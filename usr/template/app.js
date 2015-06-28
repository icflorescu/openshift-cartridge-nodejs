var http = require('http'),
    env  = process.env,
    server = http.createServer(function(req, res) {
      res.writeHead(200);
      res.end('Process ' + process.pid + ' says hi (node ' + process.version + ')!');
    });

server.listen(
  env.NODE_PORT || 3000,
  env.NODE_IP || 'localhost',
  function() {
    console.log('Application worker ' + process.pid + ' started...');
  }
);
