var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');
const http = require('http').Server(app);

const io = require('socket.io')(http);

const environment = process.env.NODE_ENV || 'development';
// const configuration = require('../knexfile')[environment];
// const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.polls = [];
app.locals.users = [];
app.locals.pollIndex = 0;

const createNewPoll = (pollData) => {
  const pollInfo = {
    urlExt: app.locals.pollIndex,
    data: pollData,
    pollScores: [
      [],
      [],
      [],
      []
    ]
  }

  app.locals.polls.push(pollInfo)
  app.locals.pollIndex++

  return app.locals.pollIndex - 1
}

app.get('/api/poll/:pollid', (req, res) => {
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

io.on('connection', function (socket) {

  socket.on('login', function(user){
    //add user to array
    console.log('A user Connected');
    console.log(`there are ${Object.keys(io.sockets.connected).length} people connected`);
    socket.emit('users', Object.keys(io.sockets.connected).length )
    app.locals.users.push(user)
  })

  app.locals.polls.forEach( function(poll){
    socket.on(`vote:${poll.urlExt}`, function(optionID, user){
      //update poll scores for each user
      updatePollScores(optionID, user, poll.urlExt)
      updateClientScores(socket, poll.urlExt)
    })
  });

  socket.on('logout', function(user){
    //add user to array
    app.locals.users = app.locals.users.filter((item)=>{
      return item.user_id !== user.user_id
    })
  })
})

const updatePollScores = (optionID, pollUser, pollID) => {
  let poll = app.locals.polls[pollID]

  let pollScores = poll.pollScores.map((question)=>{
    return question.filter((user)=>{
      return user.user_id !== pollUser.user_id
    })
  });

  pollScores[optionID].push(pollUser)

  poll.pollScores = pollScores;
  app.locals.polls[pollID] = poll;
}

const updateClientScores = (socket, pollID) => {
  io.sockets.emit(`vote:${pollID}`, app.locals.polls[pollID].pollScores)
}

var port_number = process.env.PORT || 3001

http.listen(port_number, function () {
  console.log('RrrarrrrRrrrr server alive on port 3001')
});

module.exports = app;
