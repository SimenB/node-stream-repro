'use strict';

const { get } = require('http');
const express = require('express');
const fetch = require('node-fetch');
const pump = require('pump');

const server1 = express();
const server2 = express();

server1.use('/endpoint', async (req, res) => {
    const f = await fetch('http://localhost:3001/endpoint');

    pump(f.body, res, err => {
        console.log(`node version is ${process.version}`);

        if (err) {
            console.log('There was an error, yay!');
            return;
        }

        console.error('There should have been an error, much sadness!');
        process.exit(1);
    });
});

async function func() {
    let clientReq;

    server2.use('/endpoint', (req, res) => {
        // write header
        res.writeHead(200);
        setTimeout(() => {
            clientReq.abort();
            res.end('write something after other side is closed');
        }, 200);
    });

    await new Promise((resolve, reject) => {
        clientReq = get(
            {
                hostname: 'localhost',
                port: 3000,
                path: '/endpoint',
                timeout: 100,
                agent: false,
            },
            reject
        ).on('error', () => {
            setTimeout(resolve, 150);
        });
    });
}

let port = 3000;

Promise.all(
        [server1, server2].map(server => new Promise(resolver => server.listen(port++, resolver)))
    )
    .then(() => func())
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
