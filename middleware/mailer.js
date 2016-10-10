var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify(function(error, success) {
   if (error) {
       console.log('Something wrong with email service!');
       console.log(error);
   } else {
        console.log('Email service is active!');
   }
});

exports.test = () => {
    console.log("test");
};

/**
 * @param {string} How to call user
 * @param {string} email
 */
exports.sendVerificationLetter = (username, email) => {
    console.log('[middleware/mailer.js:24] Sending mail -', username, email);
    var messageOptions = {
        from: '"Olymplan" <' + process.env.EMAIL_FULL_ADDRESS + '>',
        to: email,
        subject: 'Добро пожаловать в Олимплан',
        text: "Привет " + username  + ",\n \n добро пожаловать в Олимплан. Подтверди регистрацию, перейдя по следующей ссылке:\n\n" +
                "http://localhost:8080/user \n\n\n\n -----\n С уважением, я",
        html: "<p>Привет " + username + ",</p><p>добро пожаловать в Олимплан. Подтверди регистрацию, перейдя по следующей ссылке:</p>" +
                "<a href='http://localhost:8080/user'>http://localhost:8080/user</a>" +
                "<hr><p>С уважением, я</p>"
    };

    transporter.sendMail(messageOptions, (err, info) => {
        if (err) console.log(JSON.stringify(err));
        else     console.log(JSON.stringify(info));
    });
};
