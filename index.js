'use strict';

const { get } = require('http');
const express = require('express');
const request = require('request');
const pump = require('pump');

const server1 = express();
const server2 = express();

server1.use('/endpoint', (req, res) => {
    pump(request.get('http://localhost:3001/endpoint'), res, err => {
        console.log(`node version is ${process.version}`);

        if (err) {
            console.log('There was an error, yay!', err);
            return;
        }

        console.error('There should have been an error, much sadness!');
        process.exit(1);
    });
});

let port = 3000;

Promise.all(
    [server1, server2].map(
        server => new Promise(resolver => server.listen(port++, resolver))
    )
)
    .then(() => {
        let clientReq;

        server2.use('/endpoint', (req, res) => {
            // write header
            res.writeHead(200);
            setTimeout(() => {
                clientReq.abort();
                res.end('write something after other side is closed');
            }, 200);
        });

        return new Promise((resolve, reject) => {
            clientReq = get(
                'http://localhost:3000/endpoint',
                reject
            ).on('error', () => {
                setTimeout(resolve, 150);
            });
        });
    })
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
