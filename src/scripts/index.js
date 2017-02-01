$(document).ready(function() {

  $('.submit-new-poll').on('click', function(e) {
    e.preventDefault();

    const formObj = {
      title: $('#form-poll-title').val(),
      options: [
        {
          id: 0,
          text: $('#form-poll-option1').val()
        },
        {
          id: 1,
          text: $('#form-poll-option2').val()
        },
        {
          id: 2,
          text: $('#form-poll-option3').val()
        },
        {
          id: 3,
          text: $('#form-poll-option4').val()
        }
      ]
    };

    fetch(`/api/newpoll`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pollData: formObj
      })
    }).then( res =>{
      return res.json();
    }).then( res =>{

      return window.location = `/poll/?poll=${res.pollID}`
    })

  });

});
