const express = require("express");
const WebSocket = require("ws");
const { PrismaClient } = require("@prisma/client");
const { runProducer, initKafka } = require("./kafka");

const app = express();
const prisma = new PrismaClient();
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  clients.add(ws);

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

// Poll Creation API
app.post("/polls", async (req, res) => {
  const { question, options } = req.body;

  // Create the poll in the database
  const poll = await prisma.poll.create({
    data: {
      question,
      options: {
        create: options.map((option) => ({ text: option })),
      },
    },
  });

  res.json(poll);
});

// Vote API (Kafka Integration)
app.post("/polls/:id/vote", async (req, res) => {
  const { id } = req.params;
  const { optionId } = req.body;

  // Send the vote message to Kafka for processing
  const voteMessage = { pollId: Number(id), optionId: optionId };
  await runProducer(voteMessage);

  res.status(200).send("Vote submitted");
});

// Poll Results API
app.get("/polls/:id", async (req, res) => {
  const { id } = req.params;

  // Fetch the poll and its options from the database
  const poll = await prisma.poll.findUnique({
    where: { id: Number(id) },
    include: { options: true },
  });

  res.json(poll);
});

// Start the Kafka consumer and WebSocket server
initKafka().then(() => {
  console.log("Kafka consumer is ready and listening for votes");
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
