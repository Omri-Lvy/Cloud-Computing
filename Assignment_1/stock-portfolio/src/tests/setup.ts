import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

beforeAll(async () => {
    if (!process.env.NINJA_API_KEY) {
        throw new Error('NINJA_API_KEY environment variable is not set');
    }

}, 30000);

afterAll(async () => {
    try {
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}, 30000);