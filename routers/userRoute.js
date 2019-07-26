const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  User,
  validateRegisterUser,
  validateLoginUser
} = require("../model/userModel");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

//login
router.post("/api-token-auth", async (req, res) => {
  // data format is not correct
  const { error } = validateLoginUser(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or Password is invalid"); //user doesn't exist

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Email or Password is invalid"); //password is wrong

  // user didn't activate
  if (!user.is_active)
    return res.status(400).send("user has not been activated");

  const token = user.generateJwtToken();

  return res.status(200).send({ token }); //shit for {token}
});

//register users
router.post("/users", async (req, res) => {
  //validate user data if error then return error message
  const { error } = validateRegisterUser(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    //to check if the email has been registered
    const result = await User.findOne({ email: req.body.email }); //result will be the whole document that you find
    if (result) res.status(400).send("the email has already been used");

    //hash user password
    const user = new User(
      _.pick(req.body, ["first_name", "last_name", "email", "password"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //save user to db if error then return error message
    await user.save();

    //send verification link to this email
    const jwtToken = user.generateJwtToken();
    user.sendVerificationEmail(jwtToken);

    //return user info
    return res
      .status(201)
      .send(_.pick(user, ["first_name", "last_name", "email"]));
  } catch (ex) {
    console.log("user registration exception:", ex);
  }
});

router.get("/users/verify_email/:userId/:token", async (req, res) => {
  try {
    const user = jwt.verify(req.params.token, config.key);
    await User.update(
      { _id: user._id },
      {
        $set: {
          is_active: true
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
  return res.redirect("http://localhost:3001/login");
});

module.exports = router;
