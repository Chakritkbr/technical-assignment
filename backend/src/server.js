import app from './app.js';
import http from 'http';
import { setupSocket } from './services/socket.service.js';

const server = http.createServer(app);
setupSocket(server);
console.log(`PORT env: ${process.env.PORT}`);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
