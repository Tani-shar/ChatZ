import Message from "../models/MessageModel.js";

export const getMessages = async (req, res) => {
  try {
    const user1 = req.body.userId;
    const user2 = req.body.id;
    
    if (!user1 || !user2) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    // Fixed query to match actual message structure
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
      
    // Return empty array instead of 404
    if (!messages) {
      return res.status(200).json({ messages: [] });
    }
    
    console.log(`Found ${messages.length} messages between ${user1} and ${user2}`);

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving messages" });
  }
};