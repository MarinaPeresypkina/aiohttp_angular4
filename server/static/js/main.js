$(document).ready(function(){
    var sock = new WebSocket('ws://' + window.location.host + '/ws?token=' +
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiaWQiOjJ9.EwKM0WKZ9J2J6JXHIAFynF7IcQ8qZ43cb5ApZw-j6TI");

    // show message in div#subscribe
    function showMessage(message) {
        var messageElem = $('#subscribe'),
            height = 0,
            date = new Date();
            options = {hour12: false};
        messageElem.append($('<p>').html('[' + date.toLocaleTimeString('en-US', options) + '] ' + message + '\n'));
        messageElem.find('p').each(function(i, value){
            height += parseInt($(this).height());
        });

        messageElem.animate({scrollTop: height});
    }

    function sendMessage(){
        var msg = $('#message');
        sock.send(msg.val());
        msg.val('').focus();
    }

    sock.onopen = function(){
        showMessage('Connection to server started')
    }

    // send message from form
    $('#submit').click(function() {
        sendMessage();
    });

    $('#message').keyup(function(e){
        if(e.keyCode == 13){
            sendMessage();
        }
    });

    // income message handler
    sock.onmessage = function(event) {
      showMessage(event.data);
    };

    $('#signout').click(function(){
        window.location.href = "signout"
    });

    sock.onclose = function(event){
        if(event.wasClean){
            showMessage('Clean connection end')
        }else{
            showMessage('Connection broken')
        }
    };

    sock.onerror = function(error){
        showMessage(error);
    }
});