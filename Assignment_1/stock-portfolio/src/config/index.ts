import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'NINJA_API_KEY', 'NINJA_API_URL'] as const;
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} environment variable is not set`);
    }
}

export const config = {
    ninjaApiKey: process.env.NINJA_API_KEY as string,
    port: process.env.PORT || '5001'
} as const;