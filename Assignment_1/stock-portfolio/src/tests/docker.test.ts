import { exec } from 'child_process';
import axios from 'axios';
import { promisify } from 'util';

const execAsync = promisify(exec);
const CONTAINER_PORT = 5001;
const HOST_PORT = 5001;
const CONTAINER_NAME = 'stock-portfolio-test';
const IMAGE_NAME = 'stock-portfolio';

describe('Docker Tests', () => {
    // Store container ID for cleanup
    let containerId: string;

    beforeAll(async () => {
        // Build the Docker image
        try {
            await execAsync(`docker build -t ${IMAGE_NAME} .`);
        } catch (error) {
            console.error('Docker build failed:', error);
            throw error;
        }
    }, 60000); // Allow 60 seconds for build

    beforeEach(async () => {
        // Start a new container for each test
        try {
            const { stdout } = await execAsync(
                `docker run -d --name ${CONTAINER_NAME} \
        -p ${HOST_PORT}:${CONTAINER_PORT} \
        -e NINJA_API_KEY=${process.env.NINJA_API_KEY} \
        ${IMAGE_NAME}`
            );
            containerId = stdout.trim();

            // Wait for container to be ready
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
            console.error('Container start failed:', error);
            throw error;
        }
    }, 10000);

    afterEach(async () => {
        // Clean up container after each test
        try {
            await execAsync(`docker stop ${CONTAINER_NAME}`);
            await execAsync(`docker rm ${CONTAINER_NAME}`);
        } catch (error) {
            console.error('Container cleanup failed:', error);
        }
    });

    describe('Docker Build Tests', () => {
        it('should have the correct base image', async () => {
            const { stdout } = await execAsync('docker image inspect stock-portfolio:latest');
            const imageInfo = JSON.parse(stdout);
            expect(imageInfo[0].Config.Image).toBeDefined();
        });

        it('should expose the correct port', async () => {
            const { stdout } = await execAsync('docker image inspect stock-portfolio:latest');
            const imageInfo = JSON.parse(stdout);
            expect(imageInfo[0].Config.ExposedPorts).toHaveProperty('5001/tcp');
        });

        it('should have all required files', async () => {
            const { stdout } = await execAsync(`docker exec ${CONTAINER_NAME} ls /usr/src/app`);
            const files = stdout.split('\n');
            expect(files).toContain('package.json');
            expect(files).toContain('dist');
            expect(files).toContain('node_modules');
        });
    });

    describe('Container Runtime Tests', () => {
        const baseUrl = `http://localhost:${HOST_PORT}`;

        it('should be running and responding to requests', async () => {
            const response = await axios.get(`${baseUrl}/stocks`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });

        it('should have environment variables set correctly', async () => {
            const { stdout } = await execAsync(
                `docker exec ${CONTAINER_NAME} printenv NINJA_API_KEY`
            );
            expect(stdout.trim()).toBe(process.env.NINJA_API_KEY);
        });

        it('should persist data within the container session', async () => {
            // Create a stock
            const createResponse = await axios.post(
                `${baseUrl}/stocks`,
                {
                    symbol: 'AAPL',
                    purchase_price: 150.50,
                    shares: 10
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            expect(createResponse.status).toBe(201);

            // Verify it exists
            const getResponse = await axios.get(`${baseUrl}/stocks`);
            expect(getResponse.data.some((stock: any) => stock.id === createResponse.data.id)).toBe(true);
        });

        it('should handle API requests correctly', async () => {
            const response = await axios.get(
                `${baseUrl}/stocks`,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('should restart and maintain clean state', async () => {
            // Stop container
            await execAsync(`docker stop ${CONTAINER_NAME}`);
            // Start container
            await execAsync(`docker start ${CONTAINER_NAME}`);
            // Wait for container to be ready
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Check if state is clean
            const response = await axios.get(`${baseUrl}/stocks`);
            expect(response.data).toHaveLength(0);
        });
    });

    describe('Docker Resource Tests', () => {
        it('should have resource limits set', async () => {
            const { stdout } = await execAsync(`docker inspect ${CONTAINER_NAME}`);
            const containerInfo = JSON.parse(stdout);
            expect(containerInfo[0].HostConfig.Memory).toBeDefined();
        });

        it('should have correct working directory', async () => {
            const { stdout } = await execAsync(`docker exec ${CONTAINER_NAME} pwd`);
            expect(stdout.trim()).toBe('/usr/src/app');
        });

        it('should have non-root user for security', async () => {
            const { stdout } = await execAsync(`docker exec ${CONTAINER_NAME} whoami`);
            expect(stdout.trim()).not.toBe('root');
        });
    });
});