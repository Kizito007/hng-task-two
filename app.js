const express = require("express"),
    app = express(),
    nodemailer = require("nodemailer"),
    multiparty = require("multiparty"),
    mustache = require("mustache-express");

require("dotenv").config();

const PORT = process.env.PORT
  
app.engine('mustache', mustache());
app.set('view engine', 'mustache'); 
app.use("/public", express.static("public")); 

const transporter = nodemailer.createTransport({
    service: "gmail", //replace with your email provider
    port: 993,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    }, 
}); 
  // verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});
  
//setup routes

app.get('/', (req, res) => {
    res.render("index");
});

app.post("/send", (req, res) => {
    //1.
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
      console.log(fields);
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString();
      });
  
      //2. You can configure the object however you want
      const mail = {
        from: data.firstname,
        to: process.env.EMAIL,
        subject: data.subject,
        text: `${data.lastname} <${data.email}> \n${data.message}`,
      }; 
  
      //3.
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send("Something went wrong.");
        } else {
          res.status(200).send("Email successfully sent to recipient!");
        }
      });
    });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});