"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const KafkaClient = new kafkajs_1.Kafka(config);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = KafkaClient.producer({
            idempotent: true,
        });
        yield producer.connect();
        const message = "Hola mundo";
        const message2 = "Hello world";
        const messageConfig = {
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
        yield producer.send(messageConfig);
        yield producer.disconnect();
    });
}
run().then(() => console.log("Producer finished")).catch(console.error);
//# sourceMappingURL=index.js.map