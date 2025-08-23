const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Plant Care App <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async send(template, subject) {
    const html = `
      <h1>Hello ${this.firstName}!</h1>
      <p>${subject}</p>
      <a href="${this.url}">Click here</a>
    `;

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Plant Care App!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for 10 minutes)');
  }

  async sendAdminWelcome() {
    await this.send('adminWelcome', 'Welcome to Plant Care Admin Panel!');
  }
};