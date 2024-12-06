import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CONTAINER_NAME = "stock-portfolio-container";

async function setupDocker() {
    console.log("\n🐳 Setting up Docker environment...");

    // Stop and remove any existing container
    try {
        console.log("🔄 Cleaning up old Docker containers...");
        await execAsync(`docker stop ${CONTAINER_NAME}`).catch(() => console.log("No existing container to stop."));
        await execAsync(`docker rm ${CONTAINER_NAME}`).catch(() => console.log("No existing container to remove."));
    } catch (error) {
        console.error("❌ Failed during cleanup:", error);
        throw error;
    }

    // Build and run the container
    try {
        console.log("🚀 Building Docker image...");
        await execAsync("docker build -t stock-portfolio .");

        console.log("📦 Running Docker container...");
        await execAsync(`docker run -d -p 5001:5001 --name ${CONTAINER_NAME} stock-portfolio`);

        // Wait for the container to initialize
        console.log("⏳ Waiting for the server to initialize...");
        await delay(5000);
    } catch (error) {
        console.error("❌ Failed to start Docker container:", error);
        throw error;
    }
}

async function teardownDocker() {
    console.log("\n🧹 Cleaning up Docker environment...");
    try {
        await execAsync(`docker stop ${CONTAINER_NAME}`);
        await execAsync(`docker rm ${CONTAINER_NAME}`);
        console.log("✅ Docker environment cleaned up.");
    } catch (error) {
        console.error("❌ Failed during cleanup:", error);
    }
}

// Jest global setup and teardown hooks
beforeAll(async () => {
    await setupDocker();
});

afterAll(async () => {
    await teardownDocker();
});
