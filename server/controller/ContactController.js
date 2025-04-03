import User from "../models/UserModel.js";

export const searchContacts = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm?.trim()) { // Handles undefined, null, and empty strings
            return res.status(400).json({ message: "Search term is required" });
        }

        const sanitizedSearchTerm = searchTerm.trim().replace(/[^a-zA-Z0-9 ]/g, '');
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            _id: { $ne: req.userId }, // Exclude current user
            $or: [{ fullName: regex }, { email: regex }],
        });

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({ message: "An error occurred while searching for contacts" });
    }
};
