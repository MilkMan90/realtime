var socket = io();


$(document).ready(function() {

  let pollID = getParameterByName('poll');

  getPollData(pollID).then((res)=>{
    populatePollData(res.data, pollID)
    updateVoterImages(res.pollScores)
  });

  socket.on(`users`, function(res){
    updateNumberOfUsers(res)
  })
})

const getPollData = (pollID) => {
  return fetch(`/api/poll/${pollID}`)
    .then( res =>{
      return res.json();
    })
}

const updateNumberOfUsers = (numberOfUsers) =>{
  $('.number-of-users').text(`There are ${numberOfUsers} users online`)
}

const populatePollData = (pollData, pollID) => {
  $('.poll-title').text(pollData.title)
  pollData.options.forEach((option)=>{
    return populateOptions(option, pollID)
  })
  socket.on(`vote:${pollID}`, function(pollScores){
    updateVoterImages(pollScores);
  })
  if(!profileInfo){
    console.log('hiding poll container');
    $('#poll-container').hide()
  }
}

const updateVoterImages = (pollScores) =>{
  pollScores.forEach((userArray, i)=>{
    $(`.option${i}votes`).empty();

    userArray.forEach((user)=>{
      $(`.option${i}votes`).append(`
        <img class='user-img' src=${user.picture}/>
        `);
    })
  })
}

const populateOptions = (option, pollID) => {
  $('#poll-options').append(`
    <div class=option-container>
      <button class=option${option.id}>${option.text}</button>
      <div class=option${option.id}votes>
      </div>
    </div>
    `)
  $(`.option${option.id}`).addClass('poll-option')
  $(`.option${option.id}votes`).addClass('vote-container')

  $(`.option${option.id}`).on('click', function(){
    sendPollToServer(option.id, pollID)
  })

}

const sendPollToServer = (optionID, pollID) => {
  socket.emit(`vote:${pollID}`, optionID, profileInfo)
}
