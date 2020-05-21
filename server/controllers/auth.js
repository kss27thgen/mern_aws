const AWS = require("aws-sdk");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { registerEmailParams } = require("../helpers/email");
const shortId = require("shortid");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: "ap-south-1",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = (req, res) => {
	const { name, email, password } = req.body;

	User.findOne({ email }).exec((err, user) => {
		if (user) {
			return res.status(400).json({
				error: "Email is taken",
			});
		}
		// genrearate token with username, email and password
		const token = jwt.sign(
			{ name, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{ expiresIn: 360000 },
		);

		// send emial
		const params = registerEmailParams(email, token);

		const sendEmailOnRegistration = ses.sendEmail(params).promise();

		sendEmailOnRegistration
			.then((data) => {
				console.log("Email submitted to SES", data);
				res.json({
					message: `Email has been sent to ${email}, Follow the instructions to complete your registration`,
				});
			})
			.catch((err) => {
				console.log("SES email on register", err);
				res.json({
					message: "We could not verify your email, Please try again",
				});
			});
	});
};

exports.registerActivate = (req, res) => {
	const { token } = req.body;
	jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
		err,
		decoded,
	) {
		if (err) {
			return res.status(401).json({
				error: "Exprired link. Try again.",
			});
		}

		const { name, email, password } = jwt.decode(token);
		const username = shortId.generate();

		User.findOne({ email }).exec((err, user) => {
			if (user) {
				return res.status(401).json({
					error: "Email is taken",
				});
			}

			// register new user
			const newUser = new User({ username, name, email, password });
			newUser.save((err, result) => {
				if (err) {
					return res.status(401).json({
						error: "Error Saving user in database. Try later",
					});
				}
				return res.json({
					message: "Registration success. Please login",
				});
			});
		});
	});
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with that email does not exist.Please register",
			});
		}
		// authenticate
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "Email and password do not match",
			});
		}

		// generate token and send to client
		const token = jwt.sign({ _id: user._id }, "bibini", {
			expiresIn: "7d",
		});
		const { _id, name, email, role } = user;

		return res.json({
			token,
			user: { _id, name, email, role },
		});
	});
};

exports.requireSignin = expressJwt({
	secret: "bibini",
});

exports.authMiddleware = (req, res, next) => {
	const authUserId = req.user._id;
	User.findOne({ _id: authUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const adminUserId = req.user._id;
	User.findOne({ _id: adminUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}

		if (user.role !== "admin") {
			return res.status(400).json({
				error: "Admin resource. Access denied",
			});
		}

		req.profile = user;
		next();
	});
};
