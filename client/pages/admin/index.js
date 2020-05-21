import React from "react";
import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";

const Admin = ({ user, token }) => {
	return <Layout>admin page</Layout>;
};

export default withAdmin(Admin);
