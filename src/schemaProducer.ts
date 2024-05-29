import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { kafkaClient } from "./kafka";
import { ProducerConfig, ProducerRecord } from "kafkajs";

const schemaRegistry = new SchemaRegistry({ 
    host: "https://psrc-6kq702.us-east-1.aws.confluent.cloud",
    auth: {
        username: "WMZAJ6LW3XMQC4JR",
        password: "k5RtTWINaFexL26HN4ZiWHVR9XXrS9sfrA64FMvkOZ6yndNgQ+RRS26B4IDt8puN",
    },
    clientId: "demo-schemaregistry-client",
});

async function run(): Promise<void> {

    const producerConfig: ProducerConfig = {
        idempotent: true,
    }
    const producer = kafkaClient.producer(producerConfig);
    
    await producer.connect();
    try {
    
        const message: Product = {
            id: "bar",
            price: 100.00
        }

        const encodedMessage: Buffer = await schemaRegistry.encode(100001, message);

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

interface Product {
    id: string;
    price: number;
}

run().then(() => console.log("Producer finished")).catch((e) => console.log(e));