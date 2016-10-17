var Pool = require('pg').Pool,
    pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: JSON.parse(process.env.DB_USE_SSL),
        idleTimeoutMillis: 1000 //close idle clients after 1 second
    });
    tables = require("../db_tables_config.json");

var run_request = function(qstring) {
    return new Promise((resolve, reject) => {
        pool.query(qstring, function (err, result) {
            //console.log('db.js:20', result);
            if(err) {
                console.log(JSON.stringify(err));
                reject(err);
            }
            resolve(result.rows);
        });
    });
};

exports.get_by_id = function(table, id, callback) {
    var qstring = "SELECT * FROM " + table + " WHERE id = '" + id + "';";
    run_request(qstring).then((result) => {
                callback(result[0]);
            }, (err) => {
                callback(null);
            });
};

exports.get_column_as_list = (table, column_name, callback) => {
    var qstring = "SELECT id, " + column_name + " FROM " + table + ";"
    run_request(qstring).then(
        (result) => {
            callback(result);
        }, (err) => {
            callback(undefined);
        });
};

exports.validate_login = function(username, password, callback) {
    var qstring = "SELECT password FROM " + tables.user_list + " WHERE username = '" + username + "';";

    run_request(qstring)
            .then((result) => {
                if (result[0].password == password) callback({'connected': true, 'auth_success': true});
                else                                callback({'connected': true, 'auth_success': false});
            })
            .catch((err) => {
                callback({'connected': false});
            });
};

exports.validate_admin_rights = (username) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + tables.admin_list + " WHERE username = '" + username + "'";

        run_request(qstring)
            .then((result) => {
                if (result[0] == undefined) reject();
                else                        resolve();
            }).catch((e) => {console.log(e);});

    });
}

exports.get_table = (table, container_for_result = []) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + table + ";";
        run_request(qstring).then((result) => {
            resolve(container_for_result.concat([result]));
        }).catch((e) => {reject(e)});
    });
}

exports.check_username_existence = (username) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + tables.user_list +
                            " WHERE username = '"  + username + "';";

        //console.log(qstring);

        run_request(qstring).then((result) => {
            //console.log('db.js:88', result.length);
            if(result.length === 0) reject();
            else resolve();
        }).catch((result) => {
            console.log(result);
            reject();
            // FIXME: bad behaviour when DB is not responding
        });
    });
};

/**
 * Adds values from object to table
 *
 * @param {string} table name
 * @param {object} values
 * @returns {Promise}
 */
exports.addNewUser = (values, ver_code) => {
    return new Promise((resolve, reject) => {
        var qstring = "INSERT INTO " + tables.user_list + " values(";

        for(var index in values) {
            if (typeof(values[index]) !== typeof(10)) qstring += "'";
            qstring += values[index].toString();
            if (typeof(values[index]) !== typeof(10)) qstring += "'";
            qstring += ",";
        }

        qstring = qstring.substr(0, qstring.length - 1);
        qstring += ");";

        qstring += "\nINSERT INTO " + tables.verification_codes + " values('" + values['username'] + "','" + ver_code + "');";

        console.log("[db.js:120]", qstring);

        run_request(qstring).then((result) => {
            console.log("resolved");
            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
};

/**
* Deletes verification pair and states user as verified
*
* @param {string} username
* @param {string} code
* @return {void}
*/
var deleteVerificationCode = (username, code) => {
    var qstring = "DELETE FROM " + tables.verification_codes + " WHERE username = '"
                            + username + "' AND code = '" + code + "';\n"
                            + "UPDATE " + tables.user_list + " SET verified = true WHERE username = '"
                            + username + "';";
    //console.log(qstring);
    run_request(qstring);
};

/**
 * Checks if pair (username, code) exists in table, then delete if true
 *
 * @param {string} username
 * @param {string} code
 * @param {function} resolve
 * @param {function} reject
 *
 * @return {void}
 */
exports.verifyUser = (username, code, resolve, reject) => {
    var qstring = "SELECT code = '" + code + "' AS match FROM " + tables.verification_codes
                            + " WHERE username = '" + username + "';";

    //console.log(qstring);

    run_request(qstring).then((result) => {
        if (result[0].match) {
            deleteVerificationCode(username, code);
            resolve();
        }
        else {
            reject();
        }
    }).catch(() => {
        reject();
    });
};

/**
 * Returns all user data from DB
 *
 * @param {string} username
 * @return {Promise}
 */
exports.getUserData = (username) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + tables.user_list + " WHERE username = '" + username + "';";
        run_request(qstring).then(resolve).catch(reject);
    });
};
