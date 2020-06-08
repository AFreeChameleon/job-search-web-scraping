const acceptRequest = (username) => {
  $.ajax({
    url: '/accept-friend',
    method: 'POST',
    data: {
      username: username
    },
    success: (data) => {
      console.log(data);
      window.location.href = '/friendlist';
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseJSON.errors)
    }
  })
}

const rejectRequest = (username) => {
  $.ajax({
    url: '/reject-friend',
    method: 'POST',
    data: {
      username: username
    },
    success: (data) => {
      console.log(data);
      window.location.href = '/friendlist';
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseJSON.errors)
    }
  })
}