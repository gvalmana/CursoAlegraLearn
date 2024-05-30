import { v4 as uuid } from 'uuid';
import { Product } from '../models';
type eventType = 'CREATE' | 'UPDATE' | 'DELETE';

export abstract class Event<T> {
    protected _data: T;
    protected _key: string;
    protected _timestamp: string;
    protected _topic?: string;
    protected _groupId?: string;

    constructor(
        data: any,
        topic?: string,
        key?: string,
        timestamp?: string,
        groupId?: string
    ) {
        this._key = key?? uuid();
        this._timestamp = timestamp?? new Date().getTime().toString();
        this._data = data;
        this._topic = topic;
        this._groupId = groupId;
        this._data = data;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get timestamp(): string {
        return this._timestamp;
    }

    set timestamp(value: string) {
        this._timestamp = value;
    }

    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }

    get topic(): string | undefined {
        return this._topic;
    }

    set topic(value: string | undefined) {
        this._topic = value;
    }

    get groupId(): string | undefined {
        return this._groupId;
    }

    set groupId(value: string | undefined) {
        this._groupId = value;
    }
}

export class ProductEvent extends Event<Product> {
    constructor(
        data: Product,
        topic?: string,
        key?: string,
        timestamp?: string,
        groupId?: string
    ) {
        super(data, topic, key, timestamp, groupId);
    }
}
