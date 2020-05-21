import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../helpers/alerts";
import { API } from "../config";
import { isAuth } from "../helpers/auth";
import Router from "next/router";

const register = () => {
	const [state, setState] = useState({
		name: "",
		email: "",
		password: "",
		error: "",
		success: "",
		buttonText: "Register",
	});

	const { name, email, password, error, success, buttonText } = state;

	useEffect(() => {
		isAuth() && Router.push("/");
	}, []);

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Register",
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setState({
			...state,
			buttonText: "Registering..",
		});

		try {
			const res = await axios.post(`${API}/register`, {
				name,
				email,
				password,
			});

			setState({
				...state,
				name: "",
				email: "",
				password: "",
				buttonText: "Submitted",
				success: res.data.message,
			});
		} catch (err) {
			setState({
				...state,
				buttonText: "Register",
				error: err.response.data.error,
			});
		}
	};

	const registerForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input
					type="text"
					name="name"
					value={name}
					className="form-control"
					placeholder="Your name"
					autoComplete="none"
					onChange={handleChange}
				/>
			</div>
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
				<h1 className="mb-5">Register</h1>
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{registerForm()}
			</div>
		</Layout>
	);
};

export default register;
