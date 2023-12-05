const MessagesModel = require('../Models/Messages');

// CREATE operation
async function createMessage(req, res) {
  try {
    const { ticket_id, user_id, message } = req.body;

    if (!ticket_id || !user_id || !message) {
      return res.status(400).send("ticket_id, user_id, and message are required");
    }

    const newMessage = new MessagesModel({
      ticket_id: ticket_id,
      user_id: user_id,
      message: message,
    });

    const result = await newMessage.save();
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

//unlimited messaages
async function addMessageToArray(req, res) {
    try {
      const { ticket_id, user_id, newMessage } = req.body;
  
      if (!ticket_id || !user_id || !newMessage) {
        return res.status(400).send("ticket_id, user_id, and newMessage are required");
      }
  
      const result = await MessagesModel.findOneAndUpdate(
        { ticket_id: ticket_id, user_id: user_id },
        { $push: { messages: newMessage } },
        { new: true }
      );
  
      if (!result) {
        return res.status(404).send("Ticket or user not found");
      }
  
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
// READ operation - Get by ID
async function getMessageById(req, res) {
  const messageId = req.params.id;

  try {
    const message = await MessagesModel.findById(messageId);

    if (!message) {
      return res.status(404).send("Message not found");
    }

    return res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// READ operation - Get all
async function getAllMessages(req, res) {
  try {
    const allMessages = await MessagesModel.find();
    return res.status(200).send(allMessages);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// UPDATE operation
async function updateMessage(req, res) {
  const messageId = req.params.id;
  const { message } = req.body;

  try {
    const result = await MessagesModel.findByIdAndUpdate(
      messageId,
      { $set: { message: message } }
    );

    if (!result) {
      return res.status(404).send("Message not found");
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// DELETE operation
async function deleteMessage(req, res) {
  const messageId = req.params.id;

  try {
    const result = await MessagesModel.findByIdAndDelete(messageId);

    if (!result) {
      return res.status(404).send("Message not found");
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

module.exports = {
  createMessage,
  getMessageById,
  getAllMessages,
  updateMessage,
  deleteMessage,
  addMessageToArray,
};
