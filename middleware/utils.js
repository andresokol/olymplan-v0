exports.sanitizeQuotes = function (str) {
    return str.replace(/'/g, "''");
};

exports.check_forbidden_symbols = (string) => {
    return (string.search(/[^A-Za-z0-9_\-\?\!]/i) == -1);
}
