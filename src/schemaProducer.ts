import { Product } from "./models";
import { v4 as uuidv4 } from 'uuid'
import { LedgerKafkaAdapter } from "./adapters";
import { KAFKA_SCHEMA_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";

async function run(): Promise<void> {
    const message: Product = {
        id: uuidv4(),
        price: Math.random() * 1000
    };
    const ledgerKafkaClient = new LedgerKafkaAdapter();
    await ledgerKafkaClient
        .topics(KAFKA_TOPIC)
        .schema(KAFKA_SCHEMA_ID)
        .produce(message);
}

run().then(() => console.log("Producer finished")).catch((e) => console.log(e));