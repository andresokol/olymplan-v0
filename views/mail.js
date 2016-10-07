var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.show_message_input = (req, res) => {
    res.render('test.ejs', {

    });
};


exports.send_message = (req, res) => {
    var mailOptions = {
        from: '"AS ?" <sokolov-as-i@yandex.ru>', // sender address
        to: req.body.address, // list of receivers
        subject: req.body.subj, // Subject line
        text: req.body.msg, // plaintext body
        html: req.body.msg // html body
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) res.send(JSON.stringify(err));
        else     res.send(JSON.stringify(info));
    });
};
