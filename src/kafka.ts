import { Kafka, KafkaConfig, Producer, ProducerRecord } from "kafkajs";
const config: KafkaConfig = {
    brokers: ["pkc-p11xm.us-east-1.aws.confluent.cloud:9092"],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: "JG25NNFJGMQKWZWE",
        password: "fL1QSmhzWhX6y0EHKzN1aXjGObX1jsFZMulkPY7oQRjrnMwkyaA8bWpbpvi1q47z"
    },
    clientId: "demo-client-producer",
}
export const kafkaClient  = new Kafka(config);