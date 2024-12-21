import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'PORT',
    'NINJA_API_KEY',
    'NINJA_API_URL',
    'MONGODB_URI',
    'STOCKS1_COLLECTION'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} environment variable is not set`);
    }
}

export const config = {
    ninjaApiKey: process.env.NINJA_API_KEY as string,
    port: process.env.PORT || '5001',
    mongodb: {
        uri: process.env.MONGODB_URI as string,
        collection: process.env.STOCKS1_COLLECTION as string
    }
} as const;
