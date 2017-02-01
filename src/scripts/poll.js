var socket = io();
var profileInfo;

$(document).ready(function() {
  let pollID = getParameterByName('poll');
  getPollData(pollID).then((res)=>{
    populatePollData(res, pollID)
  });
  getUserProfile()
})


const getParameterByName = (name, url) => {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const getPollData = (pollID) => {
  return fetch(`/api/poll/${pollID}`)
    .then( res =>{
      return res.json();
    })
}

const populatePollData = (pollData, pollID) => {
  $('.poll-title').text(pollData.data.title)
  pollData.data.options.forEach((option)=>{
    return populateOptions(option, pollID)
  })
}

const populateOptions = (option, pollID) => {
  $('#poll-options').append(`<button class=option${option.id}>${option.text}</button>`)
  $(`.option${option.id}`).addClass('poll-option')

  $(`.option${option.id}`).on('click', function(){
    sendPollToServer(option.id, pollID)
  })
}

const sendPollToServer = (optionID, pollID) => {
  console.log(profileInfo);
  socket.emit('test', optionID, profileInfo)
  // socket.emit(`poll${pollID}`, optionID)
}

const getUserProfile = () => {
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
    }
  });

  var id_token = localStorage.getItem('id_token');
  if (id_token) {
    lock.getProfile(id_token, function (err, profile) {
      if (err) {
        return alert('There was an error getting the profile: ' + err.message);
      }
      // Display user information
      profileInfo = profile;
    });
  }
}
