import{ KAFKA_CONSUMER_GROUP_ID, KAFKA_SCHEMA_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";
import { LedgerKafkaAdapter } from "./adapters";

async function run(): Promise<void> {
    try {
        const ledgerKafkaClient = new LedgerKafkaAdapter();
        const result = await ledgerKafkaClient
            .topics(KAFKA_TOPIC)
            .group(KAFKA_CONSUMER_GROUP_ID)
            .consume();
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

run().then(() => {
    console.log("Consumer finished")
}).catch(console.error);