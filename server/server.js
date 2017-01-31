var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');
const environment = process.env.NODE_ENV || 'development';
// const configuration = require('../knexfile')[environment];
// const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.polls = [];
app.locals.pollIndex = 0;

const createNewPoll = (pollData) => {
  const pollInfo = {
    urlExt: app.locals.pollIndex,
    data: pollData
  }
  app.locals.polls.push(pollInfo)
  app.locals.pollIndex++
  return app.locals.pollIndex - 1
}

app.get('/api/poll/:pollid', (req, res) => {
  console.log(app.locals.polls[req.params.pollid]);
  res.send(app.locals.polls[req.params.pollid])
});

app.post('/api/newpoll', (req, res) => {
  let pollID = createNewPoll(req.body.pollData)
  res.send({pollID})
})

app.use(express.static(path.resolve(__dirname, '..', 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'src', 'index.html'));
});

app.get(`/poll/*`, (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'src', 'poll.html'));
})

var port_number = process.env.PORT || 3001

app.listen(port_number, function () {
  console.log('RrrarrrrRrrrr server alive on port 3001')
});

module.exports = app;
