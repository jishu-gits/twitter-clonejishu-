import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes by verifying JWT token and authenticating the user
export const protectRoute = async (req, res, next) => {
	try {
		// Retrieve JWT token from cookies
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		// Verify the token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			console.log("Token verification error:", err.message);
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		// Find the user by ID from the decoded token and exclude the password
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach the user to the request object
		req.user = user;
		next();
	} catch (err) {
		console.log("Error in protectRoute middleware:", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
