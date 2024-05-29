import { ConsumerConfig, ConsumerSubscribeTopics, EachMessageHandler, EachMessagePayload } from "kafkajs";
import { kafkaClient } from "./kafka";

async function run(): Promise<void>{
    const consumerConfig: ConsumerConfig = {
        groupId: "test-group",
    }
    const consumer = kafkaClient.consumer(consumerConfig);
    await consumer.connect();

    const consumerTopcis: ConsumerSubscribeTopics = {
        topics: ["testing-topic"],
        fromBeginning: true,
    };
    await consumer.subscribe(consumerTopcis);

    await consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
            console.log(`Received message: ${payload.message.value.toString()}`);
        },
    })
}

run().then(() => console.log("Consumer finished")).catch(console.error);