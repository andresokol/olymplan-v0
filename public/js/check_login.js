var check_forbidden_symbols = (string) => {
    return (string.search(/[^A-Za-z0-9_\-\?\!]/i) == -1);
}

var submit_login = function (event) {
    var login = $('#login_input').val(),
        password = $('#password_input').val(),
        can_submit = true;

    if (!check_forbidden_symbols(login)) {
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
    }

    if (!can_submit) return;

    $.ajax({
        url: '/api/login',
        method: 'POST',
        data: {login: login, password: password},
        dataType: 'text',
        success: (answer) => {
            answerParsed = JSON.parse(answer);
            if(!answerParsed.connected) alert("No connection to DB!");
            else {
                if (answerParsed.auth_success) document.location.href = '/admin';
                else                           alert("Wrong login/password!");
            }
        },
        error: (e) => {
            console.log(e);
            alert("No connection to the server, try again later");
        }
    });
};
