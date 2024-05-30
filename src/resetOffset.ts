import { kafkaClient } from "./adapters/kafka";
import { resetOffestConfigs } from "./configs/resetConfigs";

async function run(): Promise<void>{
    const adminKafka = kafkaClient.admin();
    
    await adminKafka.connect();

    await adminKafka.resetOffsets(resetOffestConfigs);

    await adminKafka.disconnect();
}

run().then(() => console.log("Reset offset finished")).catch(console.error);