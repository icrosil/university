/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

// Libraries
const express = require('express');
const Log = require('log');
const morgan = require('morgan');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;

// Variables
const log = new Log('info');
const app = express();

// Middlewares
app.use(morgan('dev'));

app.use('/', express.static(`${__dirname}/public`));

app.use(favicon(`${__dirname}/public/images/favicon.ico`));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true,
}));

// Router
app.post('/descent', (req, res) => {
  function run() {
    const ls = spawn(`${__dirname}/../app/build/main`, [
      '-px', req.body.point.x,
      '-py', req.body.point.y,
      '-s', req.body.step,
      '-d', req.body.delta,
      '-e', req.body.epsilon,
      '-a', req.body.accuracy,
      '-er', req.body.exitRule,
    ]);

    ls.stdout.on('data', (data) => {
      res.send(JSON.parse(data));
    });
  }
  if (req.body.compile) {
    const lsCompile = spawn('gcc', [
      '-Wall',
      '-o',
      `${__dirname}/../app/build/main`,
      `${__dirname}/../app/main.cpp`,
      '-lstdc++',
      '-std=c++11',
    ]);
    lsCompile.on('close', () => run());
  } else {
    run();
  }
});

// Start server
app.listen(3000, () => {
  log.info('Example app listening on port 3000!');
});
