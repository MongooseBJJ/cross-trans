var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    indexRoutes = require("./routes/index"),
    multer = require("multer"),
    Recaptcha = require('express-recaptcha').RecaptchaV3,
    debug = require('debug')('author'),
    mysql = require('mysql'),
    upload = multer({ dest: './public/data/uploads' });
const dotenv = require('dotenv');
const url = require('url');
dotenv.config();
const nodemailer = require("nodemailer");
const router = require("./routes/index");
const { SSL_OP_NO_TLSv1_1 } = require("constants");

process.env.NODE_ENV = "production";

var recaptcha = new Recaptcha('process.env.RECAPTCHA_SITE_KEY', 'process.env.RECAPTCHA_SECRET_KEY');

module.exports = router;
app.use(indexRoutes)

app.get('#join', recaptcha.middleware.render, function(req, res) {
    res.render('/', { captcha: res.recaptcha });
});

//ssh
// ssh
//     .connect({
//         host: process.env.SSH_host,
//         username: process.env.SSH_user,
//         privateKey: process.env.SSH_privatekey
//     })
//     .then(() => {
//         ssh.execCommand('cli ping', {
//             cwd: '/var/www'
//         }).then((result) => {
//             console.log('STDOUT: ' + result.stdout);
//             console.log('STDERR: ' + result.stderr);
//         });
//     });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(indexRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Recaptcha

// mail settings 
// POST route from contact form

var cpUpload = upload.fields([{ name: 'name' }, { name: 'email' }, { name: 'phone' }, { name: 'CDL' }, { name: 'truck' }, { name: 'otrExp' }, { name: 'movingVio' }, { name: 'accident' }, { name: 'haul' }, { name: 'time' }]);
app.post('/', cpUpload, function(req, res, next) {
    req.files['name'],
        req.files['email'],
        req.files['phone'],
        req.files['CDL'],
        req.files['truck'],
        req.files['otrExp'],
        req.files['movingVio'],
        req.files['haul'],
        req.files['time'],
        next;
    const htmlContent =
        `<ul>
      <li>Name - ${req.body.name}</li> 
      <li>Email - ${req.body.email}</li> 
      <li>Phone - ${req.body.phone}</li> 
      <li>Class A CDL - ${req.body.CDL}</li> 
      <li>Own Truck - ${req.body.truck}</li> 
      <li>OTR EXP - ${req.body.otrEXP}</li> 
      <li>Less Than 3 Moving Violations - ${req.body.movingVio}</li> 
      <li>Accidents - ${req.body.accident}</li> 
      <li>Preferred haul - ${req.body.haul}</li> 
      <li>Best Time to Contact - ${req.body.time[0]} - ${req.body.time[1]}</li>
    </ul>`

    async function main() {


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS

            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Nodemailer" <process.env.EMAIL_USER>', // sender address
            to: "<info@cross-trans>", // list of receivers
            subject: "Website Form", // Subject line
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(console.error);
    res.render('landing');
});





var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Server Has Started!");
});