const { Kafka } = require("kafkajs");
const { PrismaClient } = require("@prisma/client");

// Prisma client to interact with the database
const prisma = new PrismaClient();

// Kafka Setup
const kafka = new Kafka({
  clientId: "polling-system",
  brokers: ["localhost:29092"], // Kafka broker URL (use localhost if running locally)
  //Setting the connection timeout to 10 seconds
  connectionTimeout: 10000,
  requestTimeout: 10000,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "poll-group" });

// Producer to send votes to Kafka
const runProducer = async (message) => {
  await producer.send({
    topic: "votes",
    messages: [
      {
        value: JSON.stringify(message), // The vote message (contains poll id and option id)
      },
    ],
  });
  console.log("Vote produced:", message);
};

// Consumer to process votes from Kafka and update the database
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "votes", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const voteData = JSON.parse(message.value.toString());
      const { pollId, optionId } = voteData;

      // Update the database to increment the vote for the selected option
      const pollOption = await prisma.pollOption.update({
        where: { id: optionId },
        data: { votes: { increment: 1 } },
      });
      console.log("Vote processed:", pollOption);

      // Broadcast real-time update to WebSocket clients
      // Send the updated vote count to WebSocket clients
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ pollId, optionId, votes: pollOption.votes })
          );
        }
      });
    },
  });
};

// Initialize Kafka producer and consumer
const initKafka = async () => {
  await producer.connect();
  await runConsumer(); // Start the consumer immediately to listen for votes
};

module.exports = { runProducer, initKafka };
