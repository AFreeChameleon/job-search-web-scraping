$(document).ready(() => {
  $('#registerbtn').click(() => {
    $.ajax({
      url: '/u/register',
      method: 'POST',
      data: {
        username: $('#username').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        confirmpassword: $('#confirmpassword').val()
      },
      success: function(data) {
        console.log('success')
        window.location.href = "/login";
      },
      error: function(jqXHR, textStatus, errorThrown) {
        let errorString = '';
        if (jqXHR.responseJSON.errors) {
          for (let i = 0; i < jqXHR.responseJSON.errors.length; i++) {
            errorString = errorString + '<li>' + jqXHR.responseJSON.errors[i] + '</li>';
          }
        } else {
          errorString = errorString + '<li>' + jqXHR.responseJSON.message + '</li>';
        }
        $('#error-list').html(errorString);
      }
    })
  })
})