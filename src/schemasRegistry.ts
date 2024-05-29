import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { SchemaRegistryCredencials } from "./configs/credentials";
import { KAFKA_SCHEMA_REGISTRY_HOST, KAFKA_SCHEMA_REGISTRY_KEY, KAFKA_SCHEMA_REGISTRY_SECRET } from './configs/EviromentsVariables';

const schemaConfigCredentials: SchemaRegistryCredencials = {
    host: KAFKA_SCHEMA_REGISTRY_HOST,
    auth: {
        username: KAFKA_SCHEMA_REGISTRY_KEY,
        password: KAFKA_SCHEMA_REGISTRY_SECRET,
    },
    clientId: process.env.KAFKA_APP_CLIENT_ID ?? 'kafka-app',
};
export const schemaRegistry = new SchemaRegistry(schemaConfigCredentials);