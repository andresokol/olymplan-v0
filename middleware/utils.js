exports.sanitizeQuotes = function (str) {
    return str.replace(/'/g, "''");
};

exports.check_forbidden_symbols = (string) => {
    return (string.search(/[^A-Za-z0-9_\-\?\!]/i) == -1);
}

exports.list_to_string_range = (list) => {
    var response = '',
        prev_item = Infinity,
        cnt = 0;

    for (let index in list) {
        if (list[index] - prev_item != 1) {
            if(cnt > 1) {
                response += "-";
                response += prev_item.toString();
            }
            response += ", ";
            response += list[index].toString();
            cnt = 0;
        }
        prev_item = list[index];
        cnt += 1;
    }
    if (cnt > 1) response += "-" + prev_item.toString();

    // cutting ', ' from start
    return response.substr(2);
}
