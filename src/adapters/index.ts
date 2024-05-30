import { ConsumerConfig, ConsumerSubscribeTopics, EachMessagePayload, Kafka, KafkaConfig, Producer, ProducerConfig, ProducerRecord } from "kafkajs";
import { KAFKA_BROKERS, KAFKA_CONSUMER_GROUP_ID, KAFKA_KEY, KAFKA_SECRET } from "../configs/EviromentsVariables";
import { schemaRegistry } from "../schemasRegistry";
import { v4 as uuidv4 } from 'uuid'

export abstract class BaseKafkaAdapter {
    protected _kafkaClient: Kafka;
    protected _config: KafkaConfig;
    protected _topics: string;
    protected _groupId: string | RegExp;
    protected _producerConfig: ProducerConfig;
    protected _kafkaSchemaID: number;
    protected _consumerConfig: ConsumerConfig;
    protected _consumerSubscribeTopics: ConsumerSubscribeTopics;

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

    abstract produce(message: any): Promise<void>;
    abstract consume(): Promise<void>;
    abstract messageHandler(payload: EachMessagePayload): Promise<any>;
}

export class LedgerKafkaAdapter extends BaseKafkaAdapter {

    public async produce(message: any): Promise<void> {
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
            const encodedMessage: Buffer = await schemaRegistry.encode(this._kafkaSchemaID, message);
            const producerRecord: ProducerRecord = {
                topic: this._topics,
                messages: [
                    {
                        key: uuidv4(),
                        value: encodedMessage
                    }
                ]
            }
            await producer.send(producerRecord);
        } catch (error) {
            console.error(`Error producing message: ${error}`);
            throw error;
        } finally {
            await producer.disconnect();
        }
    }

    public async consume(): Promise<void> {
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

        const consumerTopcis: ConsumerSubscribeTopics = {
            topics: [this._topics],
            fromBeginning: true,
        };
        await consumer.subscribe(consumerTopcis);
    
        await consumer.run({
            eachMessage: this.messageHandler,
        })        
    }

    public async messageHandler(payload: EachMessagePayload): Promise<any> {
        const encodedValue = payload.message.value;
        const decodeValue = await schemaRegistry.decode(encodedValue);
        console.log(`Received message`, decodeValue);
    }
}