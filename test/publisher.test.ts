import amqplib from "amqplib";
import { AMQP_URL } from "../src/config";

(async () => {
  const connection = await amqplib.connect(AMQP_URL, "heartbeat=60");
  const channel = await connection.createChannel();
  try {
    const exchange = "nft.mint";
    const queue = "nft.mint";
    const routingKey = "nft_mint";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    const to = "0x746a28b9F4133757c293f7Cb95Cb6cda8E4913Ef";
    const amount = 1;
    const cid = "bafybeibnsoufr2renqzsh347nrx54wcubt5lgkeivez63xvivplfwhtpym";

    console.log("Publishing mint task");
    const task = { to, amount, cid };
    await channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(task))
    );

    console.log("Message published");
  } catch (e) {
    console.error("Error in publishing message", e);
  } finally {
    console.info("Closing channel and connection if available");
    await channel.close();
    await connection.close();
    console.info("Channel and connection closed");
  }
  process.exit(0);
})();
