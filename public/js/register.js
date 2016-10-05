var USERNAME_IS_FREE = false;

var checkIfNoForbiddenSymbols = function (string) {
    return (string.search(/[^A-Za-z0-9_\-\?\!]/i) == -1);
};

var matchPasswords = function(e) {
    return $('#password_input_1').val() === $('#password_input_2').val();
};

var validateEmail = function(s) {
    return s.match(/.+@.+\..+/i);
}

var checkPasswordAvailability = function (login_string, resolve, reject) {
    $.ajax({
        url: '/api/check_username/' + login_string,
        method: 'GET',
        dataType: 'text',
        success: function (answer) {
            var username_is_free = JSON.parse(answer);
            USERNAME_IS_FREE = username_is_free;
            if (username_is_free) resolve();
            else                  reject();
        }
    });
};

var submitRegData = function (event) {
    var login = $('#login_input').val(),
        password = $('#password_input_1').val(),
        can_submit = true;

    /*if (!check_forbidden_symbols(login)) {
        $('#login_input').css('background-color', "#f00");
        can_submit = false;
    } else {
        $('#login_input').css('background-color', "#fff");
    }

    if (!check_forbidden_symbols(password)) {
        $('#password_input').css('background-color', "#f00");
        can_submit = false;
    } else {
        $('#password_input').css('background-color', "#fff");
    }*/

    if (!USERNAME_IS_FREE || !matchPasswords() || !checkIfNoForbiddenSymbols(login)) {
        alert('Something wrong in your data');
        return;
    }

    alert('Ready to register "' + login + '" with password "' + password + '"');

    /*$.ajax({
        url: '/api/login',
        method: 'POST',
        data: {login: login, password: password},
        dataType: 'text',
        success: (answer) => {
            answerParsed = JSON.parse(answer);
            if(!answerParsed.connected) alert("No connection to DB!");
            else {
                if (answerParsed.auth_success) {
                    console.log("success");
                    redirect_href = extractGetParams("r");
                    if (redirect_href === undefined) redirect_href = '/user';
                    document.location.href = redirect_href;
                    //alert(redirect_href);
                }
                else {
                    alert("Wrong login/password!");
                }
            }
        },
        error: (e) => {
            console.log(e);
            alert("No connection to the server, try again later");
        }
    });*/
};

$().ready(function () {
    $('#login_input').focusout(function () {
        var inputed_login = $('#login_input').val();

        if (!checkIfNoForbiddenSymbols(inputed_login)) alert('Forbidden symbols in login!');
        else {
            checkPasswordAvailability(inputed_login, function() {
                alert('Good login!');
            }, function() {
                alert('Login is already occupied!');
            });
        }
    });

    $('#password_input_2').focusout(function() {
        if(matchPasswords()) alert('Passwords match!');
        else                 alert('Check your passwords once again!');
    });

    $('#email_input').focusout(function () {
        if (validateEmail($(this).val())) alert("Good");
        else alert("Bad");
    });
});
