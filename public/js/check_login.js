var check_forbidden_symbols = function (string) {
    return (string.search(/[^A-Za-z0-9_\-\?\!]/i) == -1);
}

var extractGetParams = function(param_name) {
    var query = window.location.search.substring(1).split("&");
    //console.log(query);
    for(var index in query) {
        var pair = query[index].split("=");
        //console.log(pair);
        if (pair[0] == param_name) return pair[1];
        //console.log(pair);
    }
    return undefined;
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
                if (answerParsed.auth_success) {
                    console.log("success");
                    redirect_href = extractGetParams("r");
                    if (redirect_href === undefined) redirect_href = '/user';
                    document.location.href = redirect_href;
                    //alert(redirect_href);
                }
                else {
                    $("#err_wrong_pair").removeClass("msg_box--disabled");
                }
            }
        },
        error: (e) => {
            console.log(e);
            alert("No connection to the server, try again later");
        }
    });
};
