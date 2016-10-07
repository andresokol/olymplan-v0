/**
 * Screens single quotes for postgres
 *
 * @param {string} str
 * @return {string} sanitized string
 */
exports.sanitizeQuotes = function (str) {
    return str.replace(/'/g, "''");
};

/**
 * @param {string} string
 * @param {bool} true if no forbidden symbols
 */
exports.checkForbiddenSymbols = (string) => {
    return (string.search(/[^A-Za-z0-9_\-\?\!]/i) == -1);
}

/**
 * Validate email string as [somesymbols]@[somesymbols].[somesymbols]
 * Don't need to check more because of validation letter
 *
 * @param {string} email
 * @return {bool} true if validate_login
 */
exports.checkIfEmailValid = (str) => {
    return str.match(/.+@.+\..+/i);
}

/**
 * @param {object} list as array
 * @return {string}
 */
exports.listToStringRange = (list) => {
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
