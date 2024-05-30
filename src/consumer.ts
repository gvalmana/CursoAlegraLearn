import { ConsumerConfig, ConsumerSubscribeTopics, EachMessagePayload } from "kafkajs";
import{ KAFKA_CONSUMER_GROUP_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";
import { kafkaClient } from "./adapters/kafka";

async function run(): Promise<void>{
    const consumerConfig: ConsumerConfig = {
        groupId: KAFKA_CONSUMER_GROUP_ID,
    }
    const consumer = kafkaClient.consumer(consumerConfig);
    await consumer.connect();

    const consumerTopcis: ConsumerSubscribeTopics = {
        topics: [KAFKA_TOPIC],
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