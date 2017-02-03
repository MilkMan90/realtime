var numberOfOptions = 2;

$(document).ready(function() {

  $('.add-option').on('click', function(e){
    e.preventDefault();

    $('.options-container').append(`
        <label class="form-poll-option" for="option${numberOfOptions+1}">
          Option ${numberOfOptions+1}
          <input type="text" name="option${numberOfOptions+1}" id="form-poll-option${numberOfOptions+1}" value="">
        </label>
      `)
    numberOfOptions++;
  })

  $('.submit-new-poll').on('click', function(e) {
    e.preventDefault();

    const formObj = {
      title: $('#form-poll-title').val(),
      endDate: $('#poll-end-date').val(),
      options: getAllOptions()
    };

    // console.log(Date.now());
    // if(verifyDate(formObj.endDate)){
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

      //send date
    // } else {
    //   //error
    // }
  });
});

const getAllOptions = () => {
  let array=[];
  for(let i = 0; i < numberOfOptions; i++){
      array.push({
        id: i,
        text: $(`#form-poll-option${i+1}`).val()
      })
  }
  return array;
}
const verifyDate = (date) => {

}
