const nodemailer = require("nodemailer");
const events = require("events");
const emitter = new events.EventEmitter();

module.exports = () => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    host: "smtp.office365.com",
    port: 587,

    auth: {
      user: "hristijanSemos@hotmail.com",
      pass: "semosnodejs123",
    },
  });

  const sendMail = (title) => {
    const emailInfo = {
      from: "hristijanSemos@hotmail.com",
      to: "hristijanpetkovski@hotmail.com",
      text: `New blog-post was created`,
    };

    transporter.sendMail(emailInfo, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Еmail for successfully created blog-post has been sent");
      }
    });
  };

  emitter.on("blogpost_created", () => {
    sendMail();
  });

  emitter.emit("blogpost_created");
};
