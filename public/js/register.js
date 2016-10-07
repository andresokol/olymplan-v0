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
            console.log(answer);
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
        email = $('#email_input').val(),
        can_submit = true;

    if (!USERNAME_IS_FREE || !matchPasswords() || !checkIfNoForbiddenSymbols(login) || !validateEmail(email)) {
        alert('Something wrong in your data');
        return;
    }

    var params = {};
    params['username'] = login;
    params['password'] = password;
    params['email'] = email;

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "#");

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
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
