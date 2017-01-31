$(document).ready(function() {

  let pollID = getParameterByName('poll');
  getPollData(pollID).then((res)=>{
    populatePollData(res)
  });
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

const populatePollData = (pollData) => {
  console.log(pollData);
  $('.poll-title').text(pollData.data.title)
  pollData.data.options.forEach((option)=>{
    return populateOptions(option)
  })
}

const populateOptions = (option) => {
  $('#poll-container').append(`<button class=option${option.id}>${option.text}</button>`)
}
