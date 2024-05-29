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
const kafka_1 = require("./kafka");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumerConfig = {
            groupId: "test-group",
        };
        const consumer = kafka_1.kafkaClient.consumer(consumerConfig);
        yield consumer.connect();
        const consumerTopcis = {
            topics: ["testing-topic"],
            fromBeginning: true,
        };
        yield consumer.subscribe(consumerTopcis);
        yield consumer.run({
            eachMessage: (payload) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Received message: ${payload.message.value.toString()}`);
            }),
        });
    });
}
run().then(() => console.log("Consumer finished")).catch(console.error);
//# sourceMappingURL=consumer.js.map