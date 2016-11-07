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

/**
 *                         LOGIC OF THIS FILE
 *    There are three levels of functions in this file. First level is function
 * __runRequest, which is just passes request string to database. Second level
 * contains functions preparing request string with some parameters. And the
 * third level is export functions, which prepares these parameters
 */

//-----------------    WORK WITH DATABASE    ----------------------

/**
 * Passes request string to DB, handles errors
 *
 * @param {string} request string
 * @return {Promise}
 */
var __runRequest = function(qstring) {
    return new Promise((resolve, reject) => {
        pool.query(qstring, function (err, result) {
            //console.log('db.js:20', result);
            if(err) {
                console.log("DB request:");
                console.log(qstring);
                console.log(JSON.stringify(err));
                reject(err);
            }
            resolve(result.rows);
        });
    });
};


//-----------------   REQUEST STRING PREPARE   ----------------------

/**
* Gets specified columns
*
* @param {string} table name
* @param {object} columns names
* @param {function} callback
* @param {string} field to order by
* @param {boolean} order descending
*/
var _getColumns = (table, columns, callback, order_field = undefined, order_descending = false) => {
    var qstring = "SELECT ";
    for (let index in columns) {
        qstring += columns[index] + ",";
    }
    qstring = qstring.slice(0, -1) + " FROM " + table;

    if (order_field) {
        qstring += " ORDER BY " + order_field;
        if (order_descending) qstring += " DESC";
    }

    qstring += ";";

    __runRequest(qstring).then((result) => {
        callback(result);
    });
};

/**
* Adds row to table
*
* @param {String} table name
* @param {object} data to add
* @param {boolean} take care of index
* @param {function} callback
*/
var _addRow = (table_name, data, take_care_of_index, callback) => {
    var qstring = "INSERT INTO " + table_name + " values(";

    if (take_care_of_index) qstring += "(SELECT MAX(id) + 1 FROM " + table_name + "),";

    for(let index in data) {
        if (typeof(data[index]) !== typeof(10)) qstring += "'"; // random int inside brackets
        qstring += data[index];
        if (typeof(data[index]) !== typeof(10)) qstring += "'"; // random int inside brackets
        qstring += ",";
    }
    qstring = qstring.slice(0, -1) + ");"

    __runRequest(qstring).then((result) => {
        callback();
    }).catch((err) => {
        callback(err);
    });
};

/**
 * Gets rows by some id-value
 *
 * @param {string} field name
 * @param {var} field value
 *
 * @return {Promise}
 */
var _getRows = (field_name, field_value) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + table + " WHERE " + field_name + " = ";
        if (typeof(field_value) === typeof("string")) qstring += "'";
        qstring += field_value;
        if (typeof(field_value) === typeof("string")) qstring += "'";
        qstring += ";";

        __runRequest(qstring).then(resolve).catch(reject);
    });
};

/**
* Updates row in the table
*
* @param {string} table name
* @param {string} field to get exact row
* @param {*} field entity
* @param {object} data to update
* @param {function} callback
*/
var _updateRow = (table, field_name, field_value, data, callback) => {
    var qstring = "UPDATE " + table + " SET ";
    for (let key in data) {
        qstring += key + " = ";
        if (typeof(data[key]) === typeof("string")) qstring += "'";
        qstring += data[key];
        if (typeof(data[key]) === typeof("string")) qstring += "'";
        qstring += ", ";
    }
    qstring = qstring.slice(0, -2) + " WHERE " + field_name + " = ";
    if (typeof(field_value) === typeof("string")) qstring += "'";
    qstring += field_value;
    if (typeof(field_value) === typeof("string")) qstring += "'";
    qstring += ";";

    __runRequest(qstring).then(() => {
        callback();
    }).catch((err) => {
        callback(err);
    });
}

/**
 * Deletes row from table
 *
 * @param {string} table
 * @param {string} field to reference
 * @param {var} field value
 *
 * @return {Promise}
 */
var _deleteRow = (table, field_name, field_value) => {
    return new Promise((resolve, reject) => {
        var qstring = "DELETE FROM " + table + " WHERE " + field_name + " = ";
        if (typeof(field_value) === typeof("string")) qstring += "'";
        qstring += field_value;
        if (typeof(field_value) === typeof("string")) qstring += "'";
        qstring += ";";

        __runRequest(qstring).then(resolve).catch(reject);
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

    __runRequest(qstring);
};

//-----------------           EXPORTS          ----------------------

exports.getById = function(table, id, callback, arr_to_concat = []) {
    var qstring = "SELECT * FROM " + table + " WHERE id = '" + id + "';";
    __runRequest(qstring).then((result) => {
                callback(arr_to_concat.concat(result));
            }, (err) => {
                callback(null);
            });
};


/**
 * Gets list of events for event_list.ejs
 *
 * @param {function} callback
 */
exports.getEventsForList = (callback) => {
    var columns = ['id', 'name', 'lvl', 'grade_range', 'subject_en', 'metaevent'];

    _getColumns(tables.event_list, columns, callback, 'metaevent');
};


exports.get_column_as_list = (table, column_name, callback) => {
    var qstring = "SELECT id, " + column_name + " FROM " + table + ";"
    __runRequest(qstring).then(
        (result) => {
            callback(result);
        }, (err) => {
            callback(undefined);
        });
};

exports.validate_login = function(username, password, callback) {
    var qstring = "SELECT password FROM " + tables.user_list + " WHERE username = '" + username + "';";

    __runRequest(qstring)
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

        __runRequest(qstring)
            .then((result) => {
                if (result[0] == undefined) reject();
                else                        resolve();
            }).catch((e) => {console.log(e);});

    });
}

exports.get_table = (table, container_for_result = []) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + table + ";";
        __runRequest(qstring).then((result) => {
            resolve(container_for_result.concat([result]));
        }).catch((e) => {reject(e)});
    });
}

exports.check_username_existence = (username) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + tables.user_list +
                            " WHERE username = '"  + username + "';";

        //console.log(qstring);

        __runRequest(qstring).then((result) => {
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

        __runRequest(qstring).then((result) => {
            console.log("resolved");
            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
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

    __runRequest(qstring).then((result) => {
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
        __runRequest(qstring).then(resolve).catch(reject);
    });
};

/**
 * Adds new post
 *
 * @param {string} title
 * @param {string} post body
 * @param {string} author username
 * @param {function} callback
 */
exports.addNewPostToDB = (title, body, author, callback) => {
    var data = {
                    'title': title,
                    'body': body,
                    'author': author,
                    'created': (new Date()).toString()
                };

    _addRow(tables.blog, data, true, (err) => {
        callback(err);
    });
};


/**
 * Adds post modification to DB
 *
 * @param {int} post id
 * @param {string} title
 * @param {string} body
 * @param {function} callback
 */
exports.updatePost = (id, title, body, callback) => {
    var data = {
        'title': title,
        'body': body
    };

    _updateRow(tables.blog, 'id', id, data, callback);
};


/**
 * Gets list of blog posts
 *
 * @param {function} callback
 */
exports.getBlogPosts = (callback) => {
    var columns = ['id', 'title', 'body', 'author', 'created'];
    _getColumns(tables.blog, columns, callback, 'id', true);
};
