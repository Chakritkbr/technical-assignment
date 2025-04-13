# Assignment: Real-time Chat Application

This repository contains the code for the technical assignment, built as a real-time chat application with both backend and frontend components working together.

Project Snapshot here [ Figma (technical assignment)](https://www.figma.com/design/qG86XlRNbZZTg14Zul1HuW/technical-assignment?node-id=0-1&t=12O98X5yXqKfdXxm-1)

## Project Structure

The project is organized into the following directories:

- `backend/`: Contains the backend code for the application.
    
    - `docker-compose.yml`: Docker Compose configuration for the backend and its dependencies.
        
    - `package-lock.json`: npm dependency lock file.
        
    - `package.json`: npm configuration file for the backend.
        
    - `src/`: Contains the backend source code.
        
        - `app.js`: Entry point for the Express application.
            
        - `config/`: Configuration files.
            
            - `db.js`: MongoDB connection setup.
                
        - `controllers/`: API logic controllers.
            
            - `auth.controller.js`: Handles authentication.
                
            - `message.controller.js`: Handles messages.
                
            - `room.controller.js`: Handles chat rooms.
                
        - `handlers/`: WebSocket event handlers.
            
            - `disconnect.js`: Handles user disconnection.
                
            - `message.js`: Handles WebSocket messages.
                
            - `room.js`: Handles WebSocket room events.
                
            - `status.js`: Handles WebSocket user status.
                
            - `user.js`: (Likely handles WebSocket user data.)
                
        - `middlewares/`: Express and WebSocket middleware.
            
            - `auth.middleware.js`: API authentication middleware.
                
            - `socket.middleware.js`: Middleware for WebSocket.
                
        - `models/`: Mongoose schema definitions.
            
            - `message.model.js`: Message model.
                
            - `room.model.js`: Room model.
                
            - `user.model.js`: User model.
                
        - `routes/`: API route definitions.
            
            - `auth.route.js`: API routes for authentication.
                
            - `message.route.js`: API routes for messages.
                
            - `room.route.js`: API routes for rooms.
                
        - `server.js`: Sets up and starts the HTTP and WebSocket servers.
            
        - `services/`: Various services.
            
            - `socket.service.js`: Manages the WebSocket service.
                
        - `utils/`: Utility functions.
            
            - `apiResponse.js`: API response format.
                
            - `logger.js`: Handles logging.
                
            - `socketUtils.js`: Utility functions for WebSocket operations.
                
- `frontend/`: Contains the frontend code for the application.
    
    - `eslint.config.js`: ESLint configuration.
        
    - `index.html`: Main HTML file.
        
    - `package-lock.json`: npm dependency lock file.
        
    - `package.json`: npm configuration file for the frontend.
        
    - `public/`: Static files.
        
        - `vite.svg`: Vite logo.
            
    - `README.md`: Frontend README file (may contain additional details).
        
    - `src/`: Contains the frontend source code.
        
        - `api/`: Functions for API calls.
            
            - `authAPI.js`: API for authentication.
                
            - `chatAPI.js`: API for chat operations.
                
        - `App.jsx`: Main React component.
            
        - `assets/`: Various assets (images, etc.).
            
        - `components/`: UI components.
            
            - `auth/`: Authentication-related components.
                
                - `LoginForm.jsx`: Login form.
                    
                - `RegisterForm.jsx`: Registration form.
                    
            - `Avatar.jsx`: Component for displaying user avatars.
                
            - `chat/`: Chat-related components.
                
                - `ChatArea.jsx`: Area for displaying chat messages.
                    
                - `ChatInput.jsx`: Input field for typing messages.
                    
                - `ChatLayout.jsx`: Main layout for the chat page.
                    
                - `ConnectionStatus.jsx`: Displays connection status.
                    
                - `Message.jsx`: Component for displaying individual messages.
                    
                - `RoomListItem.jsx`: Item in the chat room list.
                    
                - `Sidebar.jsx`: Sidebar (may contain room/user lists).
                    
                - `UserListItem.jsx`: Item in the user list.
                    
            - `Contact.jsx`: Component for contact lists.
                
            - `Loading.jsx`: Component for displaying loading states.
                
            - `Logo.jsx`: Component for displaying the logo.
                
            - `modal/`: Modal components.
                
                - `CreatRoomModal.jsx`: Modal for creating new chat rooms.
                    
        - `contexts/`: React Context API for global state management.
            
            - `UserContext.jsx`: Context for user information.
                
        - `hooks/`: Custom React Hooks.
            
            - `useSocket.js`: Hook for managing WebSocket connections.
                
        - `index.css`: Main CSS file.
            
        - `main.jsx`: Entry point for the React application.
            
        - `pages/`: Page-level components.
            
            - `AuthPage.jsx`: Page for authentication (Login/Register).
                
            - `ChatPage.jsx`: Main chat application page.
                
    - `vite.config.js`: Vite configuration.
        

## Technologies Used

- **Backend:**
    
    - Node.js
        
    - Express
        
    - WebSocket (`ws`)
        
    - MongoDB
        
    - Mongoose
        
    - JSON Web Tokens (JWT)
        
    - bcryptjs
        
    - cors
        
    - cookie-parser
        
    - dotenv
        
    - winston and winston-daily-rotate-file (for logging)
        
    - Docker and Docker Compose (for development)
        
- **Frontend:**
    
    - React
        
    - Vite
        
    - React Router DOM
        
    - Axios
        
    - WebSocket (browser API)
        
    - Context API
        
    - Custom Hooks
        
    - Tailwind CSS
        
    - react-icons
        
    - jwt-decode
        
    - lodash
        

## Getting Started

### Prerequisites

- Node.js (>= [Check version in `backend/package.json`])
    
- npm or yarn
    
- Docker ([Install Docker](https://docs.docker.com/get-docker/ "null"))
    
- Docker Compose ([Install Docker Compose](https://docs.docker.com/compose/install/ "null"))
    

### Installation

1. Clone the repository: `git clone <repository-url>`
    
2. Navigate to the main project directory: `cd your-project-directory`
    
3. **Install Frontend Dependencies:**
    
    - Navigate to the frontend directory: `cd frontend`
        
    - Install dependencies: `npm install`
        
4. **Set up Environment Variables:**
    
    - **Backend:** Create a `.env` file in the `backend` directory and add the following variables (example `backend/.env`):
        
        ```
        MONGO_URI=mongodb://chatapp:theworldisavampire@localhost:27017/
        JWT_SECRET=SomBigBlackMagicSecret
        CORS_ORIGIN=http://localhost:5173
        PORT=5000
        NODE_ENV=development
        ```
        
    - **Frontend:** Create a `.env` file in the `frontend` directory and add the following variables (example `frontend/.env`):
        
        ```
        VITE_API_URL = http://localhost:5000
        VITE_WS_URL=ws://localhost:5000/ws
        VITE_REACT_APP_WS_API=localhost:5000
        ```
        

### Running the Application with Docker Compose (Recommended for Backend)

This method sets up the backend, MongoDB, and mongo-express using Docker Compose.

1. Navigate to the `backend` directory: `cd backend`
    
2. Start the Docker Compose services:
    
    ```
    docker-compose up -d
    ```
    
    This command will build and start the `mongodb` and `mongo-express` containers in the background.
    
3. Install backend dependencies (required for running the backend server):
    
    ```
    npm install
    ```
    
4. Run the backend server:
    
    ```
    npm run dev
    ```
    
    The backend server will connect to the MongoDB instance managed by Docker.
    

### Running the Application without Docker Compose (Alternative Backend Setup)

1. Ensure you have MongoDB installed and running locally.
    
2. Navigate to the `backend` directory: `cd backend`
    
3. Install backend dependencies:
    
    ```
    npm install
    ```
    
4. Update the `MONGO_URI` in the `backend/.env` file to point to your local MongoDB instance if necessary.
    
5. Run the backend server:
    
    ```
    npm run dev
    ```
    

### Running the Frontend

1. Navigate to the `frontend` directory: `cd frontend`
    
2. Start the Vite development server:
    
    ```
    npm run dev
    ```
    
    The frontend will typically run at `http://localhost:5173`.
    

### Accessing mongo-express (if using Docker Compose)

If you are using Docker Compose, you can access the mongo-express web interface at `http://localhost:8081`. Use the following credentials to log in:

- **Username:** `chatapp`
    
- **Password:** `theworldisavampire`
    

### Building and Starting for Production

1. **Build Backend for Production:**
    
    - Navigate to the `backend` directory: `cd backend`
        
    - Build the application (if a build script exists):
        
        ```
        npm run build
        ```
        
    - Start the server in production mode:
        
        ```
        npm start
        ```
        
2. **Build Frontend for Production:**
    
    - Navigate to the `frontend` directory: `cd ../frontend`
        
    - Build the application:
        
        ```
        npm run build
        ```
        
    - The build files will be in the `frontend/dist` directory. You will need to set up a web server (e.g., Nginx or Apache) to serve these files.
        

## Docker Compose Configuration (Backend)
for(/example)
```
services:
  mongodb:
    image: mongo:latest
    container_name: my_mongo
    restart: always
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: chatapp
      MONGO_INITDB_ROOT_PASSWORD: theworldisavampire

  mongo-express:
    image: mongo-express
    container_name: my_mongo_express
    restart: always
    ports:
      - '8081:8081'
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: chatapp
      ME_CONFIG_MONGODB_ADMINPASSWORD: theworldisavampire
      ME_CONFIG_MONGODB_SERVER: mongodb

volumes:
  mongodb_data:
```

This example `docker-compose.yml` file defines two services:

- `mongodb`: Uses the latest MongoDB image, names the container `my_mongo`, restarts automatically, maps the host port `27017` to the container port `27017`, persists data in the `mongodb_data` volume, and sets initial root user credentials.
    
- `mongo-express`: Uses the `mongo-express` image, names the container `my_mongo_express`, restarts automatically, maps the host port `8081` to the container port `8081`, and configures it to connect to the `mongodb` service using the provided credentials.
    

## API Endpoints (Backend)

- **`Authentication (/api/auth):`**
    
    - `POST /api/auth/register`: Register a new user.
        
    - `POST /api/auth/login`: Log in an existing user.
        
- **`Room (/api/room):`**
    
    - `POST /api/room`: Create a new chat room.
        
    - `GET /api/room`: Retrieve chat rooms (may include query parameters).
        
    - `GET /api/room/:roomId`: Retrieve a specific chat room.
        
- **`Message (/api/message):`**
    
    - `POST /api/message`: Send a new message.
        
    - `GET /api/message/:roomId`: Retrieve messages for a specific chat room.
        

## WebSocket Endpoints (Backend)

(WebSocket connections are typically established at the `/ws` path as defined in `frontend/.env`).

- WebSocket connections handle various events such as `message`, `disconnect`, `room`, `status`, and `user` through the handlers in `backend/src/handlers/`.
    

## .env (Backend)

- `MONGO_URI`: URI for connecting to MongoDB.
    
- `JWT_SECRET`: Secret key for JSON Web Tokens.
    
- `CORS_ORIGIN`: URL of the frontend to enable Cross-Origin Resource Sharing.
    
- `PORT`: Port on which the backend server runs.
    
- `NODE_ENV`: Environment (development or production).
    

## .env (Frontend)

- `VITE_API_URL`: URL of the backend API.
    
- `VITE_WS_URL`: URL of the WebSocket server.
    
- `VITE_REACT_APP_WS_API`: (Potentially another way to define the WebSocket URL).
    

## Further Information

Please refer to the `README.md` files in each directory (`backend/README.md` and `frontend/README.md`, if they exist) for more specific details and configurations.
