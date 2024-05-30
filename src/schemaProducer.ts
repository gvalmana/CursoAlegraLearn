import { kafkaClient } from "./kafka";
import { ProducerConfig, ProducerRecord } from "kafkajs";
import { schemaRegistry } from "./schemasRegistry";
import { Product } from "./models";
import { KAFKA_SCHEMA_ID } from "./configs/EviromentsVariables";
import { v4 as uuidv4 } from 'uuid'

async function run(): Promise<void> {

    const producerConfig: ProducerConfig = {
        idempotent: true,
    }
    const producer = kafkaClient.producer(producerConfig);
    
    await producer.connect();
    try {
    
        const message: Product = {
            id: uuidv4(),
            price: Math.random() * 1000
        }

        const encodedMessage: Buffer = await schemaRegistry.encode(KAFKA_SCHEMA_ID, message);

        const producerRecord: ProducerRecord = {
            topic: "topic-with-schema",
            messages: [
                {
                    key: "key1",
                    value: encodedMessage
                }
            ]
        }
        
        await producer.send(producerRecord);

    } catch (error) {
        console.error(`Error producing message: ${error}`);
        throw error;
    } finally {
        await producer.disconnect();
    }

}

run().then(() => console.log("Producer finished")).catch((e) => console.log(e));