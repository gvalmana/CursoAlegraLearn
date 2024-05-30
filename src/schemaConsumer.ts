import { ConsumerConfig, ConsumerSubscribeTopics, EachMessagePayload } from "kafkajs";
import { kafkaClient } from "./kafka";
import{ KAFKA_CONSUMER_GROUP_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";
import { schemaRegistry } from "./schemasRegistry";

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
        eachMessage: messageHandler,
    })
}

async function messageHandler(payload: EachMessagePayload): Promise<void> {
    const encodedValue = payload.message.value;
    const decodeValue = await schemaRegistry.decode(encodedValue);
    console.log(`Received message`, decodeValue);
}

run().then(() => console.log("Consumer finished")).catch(console.error);