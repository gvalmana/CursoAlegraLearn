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
        const producer = kafka_1.kafkaClient.producer({
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
//# sourceMappingURL=producer.js.map