const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      status: 'ok',
      service: 'QA Demo API'
    }));
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(3005, '127.0.0.1', () => {
  console.log('Demo API running at http://127.0.0.1:3005');
});