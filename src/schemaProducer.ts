import { LedgerKafkaAdapter, CustomKafkaAdapter } from "./adapters";
import { KAFKA_SCHEMA_ID, KAFKA_TOPIC } from "./configs/EviromentsVariables";
import { Event, JournalEvent } from "./events";
import { Journal } from "./models";
import { readFile } from 'fs/promises';

async function run(): Promise<void> {

    const json = await readFile('./src/helpers/journal.json', 'utf-8');
    const dataMessage: Journal = JSON.parse(json);
    const event = new JournalEvent(dataMessage);
    event.headers.idCompany = dataMessage.company?.id?? "";
    event.headers.type = "journal-created";
    const messages: Array<Event<Journal>> = [];
    messages.push(event);
    const ledgerKafkaClient = new LedgerKafkaAdapter();
    await ledgerKafkaClient
        .topics(KAFKA_TOPIC)
        .schema(KAFKA_SCHEMA_ID)
        .produce(messages);
    //const kafkaClient = new CustomKafkaAdapter();
    //await kafkaClient.produce(messages);
}

run().then(() => console.log("Producer finished")).catch((e) => console.log(e));