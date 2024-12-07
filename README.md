# **Polling System with Real-Time Updates and Leaderboard**

This is a backend system for a **high-concurrency polling application** built using **Node.js**, **Kafka**, **Prisma** for PostgreSQL, and **WebSockets** for real-time updates. The system allows users to create polls, vote on options, and view real-time updates and a leaderboard displaying the most popular poll options.

---

## **Features**

- **Poll Creation**: Users can create polls with multiple options.
- **Vote Participation**: Users can cast votes on poll options, and votes are processed asynchronously using Kafka.
- **Real-Time Updates**: Users can view real-time poll results via WebSockets.
- **Leaderboard**: A global leaderboard displays the most popular poll options.
- **Concurrency and Fault Tolerance**: High concurrency support using Kafka for voting processing and Zookeeper for managing Kafka brokers and leader election.

---

## **Technologies Used**

- **Node.js**: Backend framework.
- **Prisma**: ORM for PostgreSQL.
- **Kafka**: Message broker to handle vote processing asynchronously.
- **Zookeeper**: Broker management and fault tolerance for Kafka.
- **PostgreSQL**: Database for storing polls and votes.
- **WebSockets**: For real-time communication to push updates to users.
- **dotenv**: To manage environment variables (e.g., database URL, port).

---

## **Setup & Installation**

Follow these steps to set up and run the project locally:

### **Clone the Repository**

```bash
git clone https://github.com/ShivanshTiwari01/polling-system.git
cd polling-system
```

## Install Dependencies

Install the required Node.js packages using npm:

```bash
npm install
```

### Set Up PostgreSQL Database

Ensure that you have PostgreSQL running. You can use Docker or a local instance.

Sample Database URL Configuration:

Create a PostgreSQL database (e.g., polling_system).
Update the .env file with your database credentials.
env
Copy code
DATABASE_URL="postgresql://username:password@localhost:5432/polling_system?schema=public"
PORT=3000
Replace username, password, and localhost with your actual PostgreSQL credentials.

### Prisma Setup

Run Prisma to generate the client and create the necessary migrations.

Generate Prisma Client:

```bash
npx prisma generate
Run the initial migrations:
```

```bash
npx prisma migrate dev --name init
```

Optionally, you can seed your database with some initial data by adding a seed script in prisma/seed.js.

### Install Docker (Optional)

If you want to run Kafka and Zookeeper via Docker, you can use the provided docker-compose.yml file.

Install Docker and Docker Compose (if not already installed).
Run the following command to bring up Kafka and Zookeeper:

```bash
docker-compose up
```

This will start Kafka and Zookeeper in separate containers.

### Start the Server

Now, start the Node.js backend server:

```bash
npm start
```

This will start the server on port 3000 (or whatever port is specified in the .env file).

## API Endpoints

### 1. Create Poll

- **Endpoint**: `POST /polls`
- **Description**: Allows users to create a new poll with multiple options.
- **Request Body**:
  ```json
  {
    "question": "What is your favorite color?",
    "options": ["Red", "Blue", "Green"]
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "question": "What is your favorite color?",
    "options": [
      { "id": 1, "text": "Red", "votes": 0 },
      { "id": 2, "text": "Blue", "votes": 0 },
      { "id": 3, "text": "Green", "votes": 0 }
    ]
  }
  ```

### 2. Vote on a Poll

- **Endpoint**: `POST /polls/:id/vote`
- **Description**: Allows users to vote on a specific option in a poll.
- **Request Body**:
  ```json
  {
    "optionId": 1
  }
  ```
- **Response**: Status 200, `"Vote submitted"`.

### 3. Get Poll Results

- **Endpoint**: `GET /polls/:id`
- **Description**: Retrieves the current results for a poll.
- **Response**:
  ```json
  {
    "id": 1,
    "question": "What is your favorite color?",
    "options": [
      { "id": 1, "text": "Red", "votes": 5 },
      { "id": 2, "text": "Blue", "votes": 3 },
      { "id": 3, "text": "Green", "votes": 1 }
    ]
  }
  ```

### 4. Leaderboard

- **Endpoint**: `GET /leaderboard`
- **Description**: Retrieves a global leaderboard ranking the most popular poll options across all active polls.
- **Response**:
  ```json
  [
    { "pollId": 1, "optionId": 1, "text": "Red", "votes": 5 },
    { "pollId": 1, "optionId": 2, "text": "Blue", "votes": 3 },
    { "pollId": 2, "optionId": 1, "text": "Pizza", "votes": 10 }
  ]
  ```

## Real-Time Updates with WebSockets

The system supports real-time updates using WebSockets. Every time a user votes, the system will push updates to all connected clients. Users will see dynamic poll results without needing to refresh the page.

Connect to WebSocket Server: Users can connect to ws://localhost:8080 to receive real-time updates.
Updates: Whenever a vote is processed, the updated poll option votes are sent to all connected WebSocket clients.
Kafka & Zookeeper Setup
Kafka & Zookeeper Architecture:
Kafka is used to handle votes asynchronously.
Zookeeper ensures Kafka's fault tolerance by managing broker configurations and leader election.
To run Kafka and Zookeeper via Docker:
Clone the project and navigate to the directory.
Ensure Docker and Docker Compose are installed.
Run the following to start both services:

```bash
docker-compose up
```

### Environment Variables

-DATABASE_URL: PostgreSQL database connection URL.
-PORT: Port the Express server will run on (default: 3000).

Project Structure

```bash
/polling-system
├── /prisma/ # Prisma database schema and migrations
├── /node_modules/ # Project dependencies
├── /src/ # Main application source code
├── index.js # Express server
├── kafka.js # Kafka producer and consumer
├── .env # Environment configuration
├── .gitignore # Files to be ignored by Git
├── docker-compose.yml # Docker configuration (optional)
├── package.json # Node.js project dependencies
├── prisma.schema # Prisma schema file
└── README.md # Project documentation
```

### Contributing

Feel free to fork the repository, make changes, and submit a pull request. Contributions, bug reports, and suggestions are welcome!

### License

This project is licensed under the MIT License - see the LICENSE file for details.
