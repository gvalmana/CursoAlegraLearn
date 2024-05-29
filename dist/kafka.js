"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaClient = void 0;
const kafkajs_1 = require("kafkajs");
const config = {
    brokers: ["pkc-p11xm.us-east-1.aws.confluent.cloud:9092"],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: "JG25NNFJGMQKWZWE",
        password: "fL1QSmhzWhX6y0EHKzN1aXjGObX1jsFZMulkPY7oQRjrnMwkyaA8bWpbpvi1q47z"
    },
    clientId: "demo-client-producer",
};
exports.kafkaClient = new kafkajs_1.Kafka(config);
//# sourceMappingURL=kafka.js.map