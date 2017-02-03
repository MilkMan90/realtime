var profileInfo;

$(document).ready(function() {

  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
    }
  });

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  })

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        // Handle error
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      // Display user information
      show_profile_info(profile);
      profileInfo = profile;

    });
  });

  //retrieve the profile:
  var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
        show_profile_info(profile);
        profileInfo = profile;
      });
    }
  };

  var show_profile_info = function(profile) {
     $('.nickname').text(profile.name);
     $('.btn-login').hide();
     $('.avatar').attr('src', profile.picture).show();
     $('.btn-logout').show();
  };

  var clear_profile_info = function() {
    $('.btn-login').show();
    $('.avatar').hide();
    $('.btn-logout').hide();
  }

  var logout = function() {
    localStorage.removeItem('id_token');
    clear_profile_info();
    $('#poll-container').hide()
    $('.nickname').text('')
    socket.emit('logout', profileInfo )
  };

  retrieve_profile();
});
