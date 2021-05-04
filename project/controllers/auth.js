const successResponse = require("../lib/success-response-sender");
const errorResponse = require("../lib/error-response-sender");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      if (
        !req.body.password ||
        req.body.password != req.body.confirmation_password
      ) {
        return errorResponse(res, 400, "Bad request. Passwords do not match");
      }

      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return errorResponse(
          res,
          400,
          "Bad request. User exists with the provided email."
        );
      }

      req.body.password = bcrypt.hashSync(req.body.password);

      await User.create(req.body);

      successResponse(res, "User registered");
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return errorResponse(
          res,
          400,
          "Bad request. User with the provided email does not exist."
        );
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return errorResponse(res, 401, "Bad request. Incorrect password.");
      }

      const payload = {
        id: user._id,
        email: user.email,
      };

      const token = jwt.sign(payload, "3218943205PADSOKDASI(*#$U(", {
        expiresIn: "30m",
      });

      successResponse(res, "JWT successfully generated", token);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  refresh_token: (req, res) => {
    try {
      const payload = {
        id: req.user.id,
        email: req.user.email,
      };

      const token = jwt.sign(payload, "3218943205PADSOKDASI(*#$U(", {
        expiresIn: "30min",
      });
      successResponse(res, "JWT successfully refreshed", token);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
};
