import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";


import nodemailer from "nodemailer";


dotenv.config({ path: "./.env" });


const app = express();

const PORT = process.env.PORT;

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  origin: '*',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



const API_URL = 'http://localhost:';

app.listen(PORT, () => {
  console.log(`Server Running on Port ${API_URL}${PORT}`);
})

app.get('/', (req, res) => {
  res.json({
    "decision": "!! jane de hota he!!",
  });
});

// send mail to 
app.post('/send', (req, res) => {

  const output = `
    <p>===========================================</p>
    <br/>
    <p> New contact request from ${req.body.name}</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    <br/>
    
    <p>===========================================</p>
    <br/>
    <img src="cid:uniq-contactUs.png" alt="contactUs" />
  `;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: `Msg from ${req.body.email} <${process.env.USER_EMAIL}>`, // sender address
    to: `${req.body.email}`, // list of receivers
    subject: 'Contact us form', // Subject line
    text:
      `
    ==========================================
    
    Contact us form submit by : 
    Name: ${req.body.name}
    Email: ${req.body.email}
    Phone: ${req.body.phone}
    
    Message:

    ${req.body.message}

    ===========================================
    `,
    html: output,
    // attachments: [
    //   {
    //     filename: 'contactUs.png',
    //     path: './public/images/contactUs.png',
    //     cid: 'uniq-contactUs.png'
    //   }
    // ]
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({
        "decision": "error",
      });
    }
    else {
      res.json({
        "decision": "success",
      });
    }


    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  });
});




