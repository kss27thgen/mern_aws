const express = require("express");
const router = express.Router();

// import validators
const {
	userRegisterValidator,
	userLoginValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

const {
	register,
	registerActivate,
	login,
	requireSignin,
} = require("../controllers/auth");

router.post("/register", userRegisterValidator, runValidation, register);
router.post("/register/activate", registerActivate);
router.post("/login", userLoginValidator, runValidation, login);
router.get("/secret", requireSignin, (req, res) => {
	res.json({ data: "this is secret page" });
});

module.exports = router;
