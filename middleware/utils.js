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

/**
 * @param {string} String_to_hash
 * @return {int} Hash
 */

exports.getHash = (s) => {
    var hash1 = 0,
        prime1 = 98459,
        hash2 = 0,
        prime2 = 104459;
    for (let i = 0; i < s.length; i++) {
        let chr = s.charCodeAt(i);
        hash1 = hash1 * prime1 + chr;
        hash1 |= 0;
        hash1 = Math.abs(hash1);
        hash2 = hash2 * prime2 + chr;
        hash2 |= 0;
        hash2 = Math.abs(hash2);
    }
    return hash1.toString(16) + hash2.toString(16);
};
