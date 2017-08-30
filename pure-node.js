const { get, createServer } = require('http');

let external;

// Http server
createServer((req, res) => {
    res.writeHead(200);
    setTimeout(() => {
        external.abort();
        res.end('Hello World\n');
    }, 1000);
}).listen(3000);

// Proxy server
createServer((req, res) => {
    get('http://127.0.0.1:3000', inner => {
        res.on('close', () => {
            console.log('response writable:', res.writable);
        });
        inner.pipe(res);
    });
}).listen(3001, () => {
    external = get('http://127.0.0.1:3001');
});
