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

var checkPasswordAvailability = function (login_string, before, resolve, reject) {
    $.ajax({
        url: '/api/check_username/' + login_string,
        method: 'GET',
        dataType: 'text',
        beforeSend: before,
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
        $("#err_login_forbd_symb").addClass("msg_box--disabled");
        $("#err_login_occupied").addClass("msg_box--disabled");
        $("#suc_login").addClass("msg_box--disabled");

        if (!checkIfNoForbiddenSymbols(inputed_login)) {
            $("#err_login_forbd_symb").removeClass("msg_box--disabled");
        }
        else {
            checkPasswordAvailability(inputed_login, function() {
                $("#wait_login_check").removeClass("msg_box--disabled");
            }, function() {
                $("#wait_login_check").addClass("msg_box--disabled");
                $("#suc_login").removeClass("msg_box--disabled");
            }, function() {
                $("#wait_login_check").addClass("msg_box--disabled");
                $("#err_login_occupied").removeClass("msg_box--disabled");
            });
        }
    });

    $('#password_input_2').focusout(function() {
        if(matchPasswords()) {
            $("#err_passwrd2_no_match").addClass("msg_box--disabled");
            $("#suc_passwrd2").removeClass("msg_box--disabled");
        }
        else {
            $("#err_passwrd2_no_match").removeClass("msg_box--disabled");
            $("#suc_passwrd2").addClass("msg_box--disabled");
        }
    });

    $('#email_input').focusout(function () {
        if (validateEmail($(this).val())) {
            $("#err_email_not_valid").addClass("msg_box--disabled");
            $("#suc_email").removeClass("msg_box--disabled");
        }
        else {
            $("#err_email_not_valid").removeClass("msg_box--disabled");
            $("#suc_email").addClass("msg_box--disabled");
        }
    });
});
