import { Producer, ProducerRecord } from "kafkajs";
import { kafkaClient } from "./kafka";

async function run(): Promise<void> {
    
    const producer: Producer = kafkaClient.producer({
        idempotent: true,
    });
    
    await producer.connect();
    const message: string = "Hola mundo";
    const message2: string = "Hello world";

    const messageConfig: ProducerRecord = {
        topic: "testing-topic",
        messages: [{
            key: "key1",
            value: message 
        },
        {
            key: "key2",
            value: message2
        }
    ],
    };
    await producer.send(messageConfig);
    await producer.disconnect();
}

run().then(() => console.log("Producer finished")).catch(console.error);