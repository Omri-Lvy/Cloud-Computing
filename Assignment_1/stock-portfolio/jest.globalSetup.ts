import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CONTAINER_NAME = "stock-portfolio-container";

export default async () => {
    console.log("\n🐳 Global Setup: Starting Docker container...");
    try {
        console.log("🔄 Cleaning up old Docker containers...");
        await execAsync(`docker stop ${CONTAINER_NAME}`).catch(() => console.log("No container to stop."));
        await execAsync(`docker rm ${CONTAINER_NAME}`).catch(() => console.log("No container to remove."));

        console.log("🚀 Building Docker image...");
        await execAsync("docker build -t stock-portfolio .");

        console.log("📦 Running Docker container...");
        await execAsync(`docker run -d -p 5001:5001 --name ${CONTAINER_NAME} stock-portfolio`);

        console.log("⏳ Waiting for the server to initialize...");
        await delay(5000);
        console.log("✅ Docker container is ready.");
    } catch (error) {
        console.error("❌ Failed to set up Docker container:", error);
        throw error;
    }
};
