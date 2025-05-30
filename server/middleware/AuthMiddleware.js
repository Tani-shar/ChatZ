import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("Token:", token);   
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        // console.log("User ID:", userId); // Debugging

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ message: "Forbidden" });
    }
}