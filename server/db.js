function database(app){
 this.app = app;
 this.app.locals.polls = [];
 this.app.locals.users = [];
 this.app.locals.pollIndex = 0;
}

database.prototype.getCurrentPollIndex = function() {
  return this.app.locals.pollIndex
}

database.prototype.addPollToDatabase = function(pollData) {
  let pollIndex = this.app.locals.pollIndex
  this.app.locals.polls.push(this.createNewPollObject(pollData))
  this.app.locals.pollIndex++
  return pollIndex;
}

database.prototype.getPollsFromDatabase = function() {
  return this.app.locals.polls;
}

database.prototype.getSinglePollFromDatabase = function(pollID) {
  return this.app.locals.polls[pollID]
}

database.prototype.initializePollScoreArrays = function(pollData) {
  return pollData.options.map(()=>{
    return []
  })
}

database.prototype.createNewPollObject = function(pollData) {
  return {
    urlExt: this.getCurrentPollIndex(),
    data: pollData,
    pollScores: this.initializePollScoreArrays(pollData)
  }
}

database.prototype.updateSinglePollInDatabase = function(pollID, poll) {
  this.app.locals.polls[pollID] = poll;
}

database.prototype.addUserToDatabase = function (user) {
  this.app.locals.users.push(user)
}

database.prototype.removeUserFromDatabase = function (user) {
  this.app.locals.users = this.app.locals.users.filter((item)=>{
    return item.user_id !== user.user_id
  })
}

module.exports = database;
