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
const confluent_schema_registry_1 = require("@kafkajs/confluent-schema-registry");
const kafka_1 = require("./kafka");
const schemaRegistry = new confluent_schema_registry_1.SchemaRegistry({
    host: "https://psrc-6kq702.us-east-1.aws.confluent.cloud",
    auth: {
        username: "WMZAJ6LW3XMQC4JR",
        password: "k5RtTWINaFexL26HN4ZiWHVR9XXrS9sfrA64FMvkOZ6yndNgQ+RRS26B4IDt8puN",
    },
    clientId: "demo-schemaregistry-client",
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const producerConfig = {
            idempotent: true,
        };
        const producer = kafka_1.kafkaClient.producer(producerConfig);
        yield producer.connect();
        try {
            const message = {
                id: "bar",
                price: 100.00
            };
            const encodedMessage = yield schemaRegistry.encode(100001, message);
            const producerRecord = {
                topic: "topic-with-schema",
                messages: [
                    {
                        key: "key1",
                        value: encodedMessage
                    }
                ]
            };
            yield producer.send(producerRecord);
        }
        catch (error) {
            console.error(`Error producing message: ${error}`);
            throw error;
        }
        finally {
            yield producer.disconnect();
        }
    });
}
run().then(() => console.log("Producer finished")).catch((e) => console.log(e));
//# sourceMappingURL=schemaProducer.js.map