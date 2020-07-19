const functions = require('firebase-functions')

const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const cors = require('cors')({ origin: true })
admin.initializeApp()

/**
 * Here we're using Gmail to send
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'titanfx247@gmail.com',
    pass: 'moneymoney04'
  }
})

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // getting dest email by query string
    const to = req.query.to
    const subject = req.query.subject
    const message = req.query.message

    const mailOptions = {
      from: 'TitanFX <yourgmailaccount@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
      to: to,
      replyTo: 'info@titanfx.com.ng',
      subject: subject, // email subject
      html: `<div style="max-width: 560px; padding: 20px; background: #f5f2f2; border-radius: 5px; margin: 10px auto; font-family: Source Sans Pro,Source Sans Serif; font-size: 12px; color: #666;">
            <div style="color: #ff0000; font-weight: normal;">
            <div style="max-width: 560px; padding: 20px; background: #ffffff; border-radius: 5px; margin: 40px auto; font-family: Source Sans Pro,Source Sans Serif; font-size: 12px; color: #666; border: thin solid;">
            <div style="color: #ff0000; font-weight: normal;">
            <div></div>
            <div><img class="wp-image-6513 aligncenter" src="https://firebasestorage.googleapis.com/v0/b/titanfx-6ae67.appspot.com/o/Titan%20FX%20PNG%20(3).png?alt=media&token=384e2d40-e52b-4018-a4cc-52278fa8b098" alt='' width="116" height="38" /></div>
            <div>
            
            <hr />
            
            </div>
            </div>
            <h2></h2>
            <div style="max-width: 560px; padding: 0px; background: #ffffff; border-radius: 5px; margin: 40px auto; font-family: Open Sans,Helvetica,Arial; font-size: 15px; color: black;">
            &nbsp;
            <p style="text-align: center;">` + message + `</p>
            &nbsp;
            <div style="padding: 10px 0 90px 0; text-align: center;"><strong><a style="background: #ff0000; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 0px; letter-spacing: 0.3px;" href="https://dashboard.titanfx.com.ng/">Go To Dashboard</a></strong></div>
            </div>
            <div style="max-width: 560px; padding: 0px; background: #ffffff; border-radius: 5px; margin: 40px auto; font-family: Open Sans,Helvetica,Arial; font-size: 15px; color: black;">
            <div style="text-align: center;">
            <h2></h2>
            <div></div>
            </div>
            <p style="color: #000000;">From,</p>
            <p style="color: #000000;">Titan FX</p>
            
            </div>
            <div>
            <div style="max-width: 560px; padding: 0px; background: #ffffff; border-radius: 5px; margin: 40px auto; font-family: Open Sans,Helvetica,Arial; font-size: 15px; color: black;">
            <div style="border-bottom: 3px solid #eeeeee;">
            <div style="color: black; background: red;">
            <b></b>
            
            <span style="color: #000000;"><b>Email: </b>info@titanfx.com.ng</span>
            
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>`
    }

    // returning result
    return transporter.sendMail(mailOptions, (erro) => {
      if (erro) {
        return res.send(erro.toString())
      }
      return res.send('Sent')
    })
  })
})
