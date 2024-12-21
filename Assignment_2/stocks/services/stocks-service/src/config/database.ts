import { MongoClient, Collection } from 'mongodb';
import { Stock } from '../models/interfaces';
import { config } from './index';

let stocksCollection: Collection<Stock>;
const client = new MongoClient(config.mongodb.uri);

export const connectToDatabase = async (): Promise<void> => {
    try {
        await client.connect();
        const db = client.db();
        stocksCollection = db.collection<Stock>(config.mongodb.collection);
        console.log('Successfully connected to MongoDB.');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};

export const getStocksCollection = (): Collection<Stock> => {
    if (!stocksCollection) {
        throw new Error('Database not connected. Call connectToDatabase first.');
    }
    return stocksCollection;
};

export const closeDatabaseConnection = async (): Promise<void> => {
    await client.close();
    console.log('Database connection closed.');
};
