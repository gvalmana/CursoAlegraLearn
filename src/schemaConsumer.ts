import{ KAFKA_CONSUMER_GROUP_ID, KAFKA_SCHEMA_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";
import { LedgerKafkaAdapter } from "./adapters";

async function run(): Promise<void>{
    const ledgerKafkaClient = new LedgerKafkaAdapter();
    await ledgerKafkaClient.topics(KAFKA_TOPIC)
        .topics(KAFKA_TOPIC)
        .group(KAFKA_CONSUMER_GROUP_ID)
        .consume().then((result) => {
            console.log(result)
        }).catch((err) => {
            console.error(err)
        });
}

run().then(() => {
    console.log("Consumer finished")
}).catch(console.error);