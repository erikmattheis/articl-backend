const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => console.log('Connected to email server'))
    .catch(() => console.log(
      'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
    ));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = {
    from: config.email.from, to, subject, text,
  };
  console.log('emailing ' + to)
  const result = await transport.sendMail(msg)
  console.log('result ' + result)
};

/**const result 
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendChangePasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${config.frontendUrl}/change-password-email?token=${token}`;
  const text = `Dear user,
To change your password, click on this link: ${resetPasswordUrl}
If you did not request this change, then ignore this email.`;
  await sendEmail(to, subject, text);
  Promise.resolve(to);
};

const sendForgotUsernameEmail = async (to, usernames) => {
  const subject = 'Articl username';
  // replace this url with the link to the reset password page of your front-end app

  if (usernames.length > 0) {

    const theUsernames = usernames.map(function (user) { return user.username; }).toString();
    const text = `Dear user,

We received a request for the username(s) associated with this email:

${theUsernames}

You may log in to https://articl.net`;

    await sendEmail(to, subject, text);
  }
  Promise.resolve(to);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  const text = `Dear user,

To verify your email, click on this link: ${verificationEmailUrl}

If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
  Promise.resolve(to);
};

const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Articl.net';

  const text = `Dear ${user.nameFirst},

Your username is ${user.username}

http://articl.net
.`;
  await sendEmail(user.email, subject, text);
  Promise.resolve(user.email);
};

module.exports = {
  transport,
  sendEmail,
  sendChangePasswordEmail,
  sendForgotUsernameEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
};
