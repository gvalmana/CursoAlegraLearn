import { ConsumerConfig, ConsumerSubscribeTopics, EachMessagePayload } from "kafkajs";
import{ KAFKA_CONSUMER_GROUP_ID, KAFKA_SCHEMA_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";
import { schemaRegistry } from "./schemasRegistry";
import { kafkaClient } from "./adapters/kafka";
import { LedgerKafkaAdapter } from "./adapters";

async function run(): Promise<void>{
    const ledgerKafkaClient = new LedgerKafkaAdapter();
    await ledgerKafkaClient.topic(KAFKA_TOPIC)
        .groups(KAFKA_CONSUMER_GROUP_ID)
        .consume();
}

async function messageHandler(payload: EachMessagePayload): Promise<void> {
    const encodedValue = payload.message.value;
    const decodeValue = await schemaRegistry.decode(encodedValue);
    console.log(`Received message`, decodeValue);
}

run().then(() => console.log("Consumer finished")).catch(console.error);