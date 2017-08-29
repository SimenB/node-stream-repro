'use strict';

const { get, createServer } = require('http');
const pump = require('pump');

console.log(`node version is ${process.version}`);

let innerRequest;

// Http server
createServer((req, res) => {
    res.writeHead(200);
    setTimeout(() => {
        innerRequest.abort();
        res.end('Hello World\n');
    }, 1000);
}).listen(3000);

// Proxy server
createServer((req, res) => {
    get('http://127.0.0.1:3000', inner => {
        pump(inner, res, err => {
            if (err) {
                console.log('There was an error, yay!', err);
                process.exit(0);
            } else {
                console.log('There should have been an error, much sadness!');
                process.exit(1);
            }
        });
    });
})
    .listen(3001, () => {
        innerRequest = get('http://127.0.0.1:3001');
    });
