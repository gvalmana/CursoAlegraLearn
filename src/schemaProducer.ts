import { Product } from "./models";
import { v4 as uuidv4 } from 'uuid'
import { LedgerKafkaAdapter } from "./adapters";
import { KAFKA_SCHEMA_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";
import { Event, ProductEvent } from "./events";

async function run(): Promise<void> {
    const dataMessage: Product = {
        id: uuidv4(),
        precio: Math.floor(Math.random() * 1000),
        idCompany: Math.floor(Math.random() * 1000).toString()
    }
    const message: Event<Product> = new ProductEvent(dataMessage);
    const ledgerKafkaClient = new LedgerKafkaAdapter();
    await ledgerKafkaClient
        .topics(KAFKA_TOPIC)
        .schema(KAFKA_SCHEMA_ID)
        .produce(message);
}

run().then(() => console.log("Producer finished")).catch((e) => console.log(e));