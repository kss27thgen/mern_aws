import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../helpers/alerts";
import { API } from "../config";
import Link from "next/link";
import Router from "next/router";
import { authenticate, isAuth } from "../helpers/auth";

const Login = () => {
	const [state, setState] = useState({
		email: "",
		password: "",
		error: "",
		success: "",
		buttonText: "Login",
	});

	const { email, password, error, success, buttonText } = state;

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Login",
		});
	};

	useEffect(() => {
		isAuth() && Router.push("/");
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setState({
			...state,
			buttonText: "Loging in..",
		});

		try {
			const res = await axios.post(`${API}/login`, {
				email,
				password,
			});

			authenticate(res, () =>
				isAuth().role === "admin"
					? Router.push("/admin")
					: Router.push("/user"),
			);
		} catch (err) {
			setState({
				...state,
				buttonText: "Login",
				error: err.response.data.error,
			});
		}
	};

	const loginForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input
					type="email"
					name="email"
					value={email}
					className="form-control"
					placeholder="Email"
					autoComplete="none"
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<input
					type="password"
					name="password"
					value={password}
					className="form-control"
					placeholder="Password"
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<button className="btn btn-secondary">{buttonText}</button>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className="col-md-6 offset-md-3">
				<h1 className="mb-5">Login</h1>
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{loginForm()}
			</div>
		</Layout>
	);
};

export default Login;
