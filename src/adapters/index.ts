import { ConsumerConfig, ConsumerSubscribeTopics, EachBatchPayload, EachMessagePayload, Kafka, KafkaConfig, Message, Producer, ProducerConfig, ProducerRecord } from "kafkajs";
import { CONSUMER_MAX_BATCH_SIZE, KAFKA_BROKERS, KAFKA_CONSUMER_GROUP_ID, KAFKA_KEY, KAFKA_SECRET } from "../configs/EviromentsVariables";
import { schemaRegistry } from "../schemasRegistry";
import { Event } from "../events";

export abstract class BaseKafkaAdapter {
    protected _kafkaClient: Kafka;
    protected _config: KafkaConfig;
    protected _topics: string;
    protected _groupId: string | RegExp;
    protected _producerConfig: ProducerConfig;
    protected _kafkaSchemaID: number;
    protected _consumerConfig: ConsumerConfig;
    protected _consumerSubscribeTopics: ConsumerSubscribeTopics;
    protected _result: Array<any>;
    
    constructor(config: KafkaConfig= null) {
        if (config) {
            this._kafkaClient = new Kafka(config);
        } else {
            this._config = {
                brokers: KAFKA_BROKERS,
                ssl: true,
                sasl: {
                    mechanism: "plain",
                    username: KAFKA_KEY,
                    password: KAFKA_SECRET,
                }
            }
            this._kafkaClient = new Kafka(this._config);
        }
        if (!this._producerConfig) {
            this._producerConfig = {
                idempotent: true,
            }
        }
        if (!this._consumerConfig) {
            this._consumerConfig = {
                groupId: KAFKA_CONSUMER_GROUP_ID,
            }
        }
        if (!this._consumerSubscribeTopics) {
            this._consumerSubscribeTopics = {
                topics: [this._topics],
                fromBeginning: true,
            };            
        }
    }
    public getKafkaClient(): Kafka {
        return this._kafkaClient;
    }

    public setKafkaClient(client: Kafka): void {
        this._kafkaClient = client;
    }

    public topics(topics: string): BaseKafkaAdapter {
        this._topics = topics;
        return this;
    }

    public group(groupId: string): BaseKafkaAdapter {
        this._groupId = groupId;
        return this;
    }

    public schema(schemaID: number): BaseKafkaAdapter {
        this._kafkaSchemaID = schemaID;
        return this;
    }

    abstract produce(message: Array<Event<any>>): Promise<void>;
    abstract consume(): Promise<Array<any>>;
    abstract messageHandler(payload: EachMessagePayload, result: Array<any>): Promise<void>;
    abstract batchHandler(payload: EachBatchPayload, result: Array<any>): Promise<void>;
}

export class LedgerKafkaAdapter extends BaseKafkaAdapter {
    
    async produce(messages: Event<any>[]): Promise<void> {
        if (!this._kafkaClient) {
            throw new Error("Kafka client not initialized");
        }
        if (!this._topics) {
            throw new Error("Topics not defined");
        }
        if (!this._kafkaSchemaID) {
            throw new Error("Schema ID not defined");
        }
        if (!this._producerConfig) {
            throw new Error("Producer config not defined");
        }
        const producer: Producer = this._kafkaClient.producer(this._producerConfig);
        await producer.connect();
        try {
            let messagesData = messages.map(async (element): Promise<Message> => {
                const encodedMessage: Buffer = await schemaRegistry.encode(this._kafkaSchemaID, element.data);
                return {
                    key: element.key,
                    value: encodedMessage,
                    timestamp: element.timestamp,
                    partition: element.partition?? null,
                    headers: element.headers?? '',
                } 
            });
            const producerRecord: ProducerRecord = {
                topic: this._topics,
                messages: await Promise.all(messagesData),
            }
            await producer.send(producerRecord);
        } catch (error) {
            console.error(`Error producing message: ${error}`);
            throw error;
        } finally {
            await producer.disconnect();
        }
    }

    async consume(): Promise<Array<any>> {
        if (!this._kafkaClient) {
            throw new Error("Kafka client not initialized");
        }
        if (!this._topics) {
            throw new Error("Topics not defined");
        }
        if (!this._consumerConfig) {
            throw new Error("Consumer config not defined");
        }
        if (!this._groupId) {
            throw new Error("Group ID not defined");
        }
        const consumer = this._kafkaClient.consumer(this._consumerConfig);
        await consumer.connect();
        try {
            const consumerTopcis: ConsumerSubscribeTopics = {
                topics: [this._topics],
                fromBeginning: false,
            };
            await consumer.subscribe(consumerTopcis);
            let result: Array<any> = [];
            await consumer.run({
                eachMessage: (payload) => this.messageHandler(payload, result),
                eachBatch: (payload) => this.batchHandler(payload, result),
                eachBatchAutoResolve: true,
            });
            return result;  
        } catch (error) {
            console.error(`Error consuming message: ${error}`);
            consumer.disconnect();
        }
    }

    async messageHandler(payload: EachMessagePayload, result: Array<any>): Promise<void> {
        const encodedValue = payload.message.value;
        const decodeValue = await schemaRegistry.decode(encodedValue);
        console.log(result);
        result.push(decodeValue);
    }

    async batchHandler(payload: EachBatchPayload, result: Array<any>): Promise<void> {
        const batchSize = CONSUMER_MAX_BATCH_SIZE;
        const totalMessages = payload.batch.messages.length;
        for (let i = 0; i < totalMessages; i+=batchSize) {
            const subSet = payload.batch.messages.slice(i, i+batchSize);
            await Promise.all(subSet.map(async(message) => {
                const encodedValue = message.value;
                const decodeValue = await schemaRegistry.decode(encodedValue);
                result.push(decodeValue);
            }));
        }
    }
}