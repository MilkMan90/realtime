var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');
const http = require('http').Server(app);

const io = require('socket.io')(http);
const db = require('./db.js');

const environment = process.env.NODE_ENV || 'development';
// const configuration = require('../knexfile')[environment];
// const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const database = new db(app);

app.get('/api/poll/:pollid', (req, res) => {
  res.send(database.getSinglePollFromDatabase(req.params.pollid))
});

app.post('/api/newpoll', (req, res) => {
  let pollID = database.addPollToDatabase(req.body.pollData)
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
    socket.emit('users', Object.keys(io.sockets.connected).length )
    database.addUserToDatabase(user)
  })

  database.getPollsFromDatabase().forEach( function(poll){
    socket.on(`vote:${poll.urlExt}`, function(optionID, user){
      updatePollScores(optionID, user, poll.urlExt)
      updateClientScores(socket, poll.urlExt)
    })
  });

  socket.on('logout', function(user){
    database.removeUserFromDatabase(user);
  })
})


const updatePollScores = (optionID, pollUser, pollID) => {
  let poll = database.getSinglePollFromDatabase(pollID);

  let pollScores = poll.pollScores.map((question)=>{
    return question.filter((user)=>{
      return user.user_id !== pollUser.user_id
    })
  });

  pollScores[optionID].push(pollUser)

  poll.pollScores = pollScores;
  database.updateSinglePollInDatabase( pollID, poll )
}

const updateClientScores = (socket, pollID) => {
  io.sockets.emit(`vote:${pollID}`, app.locals.polls[pollID].pollScores)
}

var port_number = process.env.PORT || 3001

http.listen(port_number, function () {
  console.log('RrrarrrrRrrrr server alive on port 3001')
});

module.exports = app;
