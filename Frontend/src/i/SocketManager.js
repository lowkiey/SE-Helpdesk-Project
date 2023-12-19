// SocketManager.js
import io from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = io('<YOUR_API_BASE_URL>');
    this.socket.on('connect', () => {
      console.log('User connected:', this.socket.id);
      this.emitSystemMessage('A user has connected', 'system');
    });

    this.socket.on('disconnect', () => {
      console.log('User disconnected:', this.socket.id);
      this.emitSystemMessage('A user has disconnected', 'system');
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    this.socket.on('newMessage', ({ sender, text }) => {
      console.log(`${sender}: ${text}`);
    });
  }

  joinChat(chatId) {
    this.socket.emit('joinChat', { chatId });
    console.log(`Socket ${this.socket.id} joined chat ${chatId}`);
  }

  sendMessage(chatId, message) {
    const formattedMessage = { sender: 'user', text: `${this.socket.id}: ${message}` };
    this.socket.emit('sendMessage', { chatId, message: formattedMessage });
    console.log(`Message sent to chat ${chatId}: ${formattedMessage.text}`);
  }

  emitSystemMessage(text, sender) {
    this.socket.emit('systemMessage', { text, sender });
    console.log(`${sender}: ${text}`);
  }
}

const socketManager = new SocketManager();
export default socketManager;
