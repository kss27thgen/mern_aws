import Head from "next/head";
import Link from "next/link";
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import { isAuth, logout } from "../helpers/auth";
import React, { useState, useEffect } from "react";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
	// custom to avoid warning(SSR)
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	useEffect(() => {
		setIsAuthenticated(isAuth());
	}, []);
	//

	const head = () => (
		<>
			<link
				rel="stylesheet"
				href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
				integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
				crossOrigin="anonymous"
			/>
			<link rel="stylesheet" href="/static/css/styles.css" />
		</>
	);

	const nav = () => (
		<ul className="nav bg-success">
			<li className="nav-item">
				<Link href="/">
					<a className="nav-link text-light">Home</a>
				</Link>
			</li>
			{!isAuthenticated && (
				<>
					<li className="nav-item">
						<Link href="/login">
							<a className="nav-link text-light">Login</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link href="register">
							<a className="nav-link text-light">Register</a>
						</Link>
					</li>
				</>
			)}
			{isAuthenticated && isAuthenticated.role === "admin" && (
				<li className="nav-item ml-auto">
					<Link href="/admin">
						<a className="nav-link text-light">
							Admin: {isAuthenticated.name}
						</a>
					</Link>
				</li>
			)}
			{isAuthenticated && isAuthenticated.role === "subscriber" && (
				<li className="nav-item ml-auto">
					<Link href="/user">
						<a className="nav-link text-light">
							{isAuthenticated.name}
						</a>
					</Link>
				</li>
			)}
			{isAuthenticated && (
				<li className="nav-item">
					<a className="nav-link text-light" onClick={logout}>
						Logout
					</a>
				</li>
			)}
		</ul>
	);

	return (
		<>
			<Head>{head()}</Head>
			{nav()}
			<div className="container py-5">{children}</div>
		</>
	);
};

export default Layout;
