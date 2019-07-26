const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const sgMail = require("@sendgrid/mail");
const hdb = require("handlebars");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

const template = fs.readFileSync("views/email.handlebars", "utf-8");
const compiledTemplate = hdb.compile(template);

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 32
  },
  password: { type: String, required: true, minlength: 6, maxlength: 255 },
  is_active: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateJwtToken = function() {
  const jwtToken = jwt.sign(
    {
      _id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email
    },
    config.key,
    {
      expiresIn: config.email_expireTime
    }
  );
  return jwtToken;
};

userSchema.methods.sendVerificationEmail = function(jwtToken) {
  sgMail.setApiKey(config.sendgrid_api_key);
  const msg = {
    to: this.email,
    from: config.email_from,
    subject: config.email_subject,
    html: compiledTemplate({
      userId: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      token: jwtToken
    })
  };
  sgMail.send(msg);
};

function validateRegisterUser(data) {
  const schema = {
    first_name: Joi.string(),
    last_name: Joi.string(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(6) //minimum characters
      .max(255) //maximum characters
      .required()
  };
  return Joi.validate(data, schema);
}

function validateLoginUser(data) {
  const schema = {
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string().required()
  };
  return Joi.validate(data, schema);
}

const User = mongoose.model("User", userSchema);

module.exports = { User, validateRegisterUser, validateLoginUser };
