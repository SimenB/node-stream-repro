# Node stream possible bug

```sh-session
$ npm install
added 50 packages in 1.421s
$ nvm use 8.1.4
Now using node v8.1.4 (npm v5.3.0)
$ node index.js
node version is v8.1.4
There was an error, yay!
$ nvm use 8.2.0
Now using node v8.2.0 (npm v5.3.0)
$ node index.js
node version is v8.2.0
There should have been an error, much sadness!
```
https://github.com/nodejs/node/issues/15029
