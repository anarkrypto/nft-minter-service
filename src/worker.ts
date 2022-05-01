import amqplib from "amqplib";
import { AMQP_URL } from "./config";
import { onError, onSuccess } from "./custom/handler";
import { mint, getTokenId } from "./contract";
const QUEUE = "nft.mint";

async function processMessage(msg) {
  console.log("processing message...");
  try {
    const { to, amount, cid } = JSON.parse(msg.content.toString()); // parse params
    const { wait, hash } = await mint(to, amount, cid); // mint new nft
    await wait(); // Wait for confirmation
    const tokenId = await getTokenId(hash); // get nft id
    onSuccess({ tokenId, hash }); // handle result with onSuccess callback
  } catch (err) {
    onError(err); // handle result with onError callback
    throw err;
  }
}

(async () => {
  const connection = await amqplib.connect(AMQP_URL, "heartbeat=60");
  const channel = await connection.createChannel();
  channel.prefetch(10);
  process.once("SIGINT", async () => {
    console.log("got sigint, closing connection");
    await channel.close();
    await connection.close();
    process.exit(0);
  });

  await channel.assertQueue(QUEUE, { durable: true });
  await channel.consume(
    QUEUE,
    async (msg) => {
      try {
        await processMessage(msg);
        await channel.ack(msg);
      } catch (err) {
        await channel.nack(msg);
      }
    },
    {
      noAck: false,
      consumerTag: "nft_store_consumer",
    }
  );
  console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();
