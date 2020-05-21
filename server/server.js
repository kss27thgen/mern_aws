const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
require("dotenv").config();

const app = express();

// middleware
app.use(express.json({ extended: false }));
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);

// connect db
mongoose
	.connect(process.env.DATABASE_CLOUD, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log("Connected to DB"))
	.catch((err) => console.log(err));

const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}!`);
});
